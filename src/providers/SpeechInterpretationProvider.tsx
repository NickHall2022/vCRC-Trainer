import { type ReactNode } from 'react';
import {
  SpeechInterpretationContext,
  type SpeechInterpretationDetails,
} from '../hooks/useSpeechInterpretation';
import { useSimulation } from '../hooks/useSimulation';
import useSound from 'use-sound';
import { useMessages } from '../hooks/useMessages';
import type { AircraftRequest, FlightStatus, RequestType } from '../types/common';
import { useAircraft } from '../hooks/useAircraft';

type Keywords = {
  keywords: string[];
  atLeastOneOf?: string[];
  alternatives?: Keywords[];
  aircraftResponse?: string;
  requiredStatus?: FlightStatus;
};

const REQUEST_KEYWORDS: Record<RequestType, Keywords> = {
  clearanceIFR: {
    keywords: ['clear', 'squawk'],
    alternatives: [
      {
        keywords: ['clearance'],
        atLeastOneOf: ['request'],
        aircraftResponse: '',
      },
      {
        keywords: [],
        atLeastOneOf: ['advise', 'ready', 'copy'],
        aircraftResponse: 'Ready to copy',
      },
    ],
  },
  readbackIFR: { keywords: ['readback correct'] },
  clearanceVFR: { keywords: ['maintain', 'departure', 'squawk'] },
  readbackVFR: { keywords: ['taxi'] },
  pushback: { keywords: ['push'], atLeastOneOf: ['approved', 'discretion'] },
  taxi: { keywords: ['taxi'] },
  pattern: { keywords: ['taxi'] },
  handoff: { keywords: ['contact tower'] },
};

const GLOBAL_ALTERNATIVES: Keywords[] = [
  {
    keywords: ['radio', 'check'],
    aircraftResponse: 'I read you loud and clear',
  },
  // {
  //   keywords: ['hold', 'position'],
  //   aircraftResponse:
  // }
];

export function SpeechInterpretatonProvider({ children }: { children: ReactNode }) {
  const { requests, completeRequest } = useSimulation();
  const { aircrafts } = useAircraft();
  const { sendMessage } = useMessages();
  const [playErrorSound] = useSound('Error.wav');

  function interpretNewSpeech(transcript: string) {
    sendMessage(transcript, 'PWM_GND', 'self');

    const callsign = getCallsign(transcript);
    for (const request of requests) {
      if (callsignsApproximatelyMatch(request.callsign, callsign)) {
        return matchRequestToTranscript(request, transcript, request.callsign);
      }
    }

    for (const aircraft of aircrafts) {
      if (callsignsApproximatelyMatch(aircraft.callsign, callsign)) {
        if (aircraft.status.includes('handed') || aircraft.status === 'departed') {
          playErrorSound();
          sendMessage(`Aircraft ${callsign} is no longer on your frequency`, '', 'system');
        }
        return checkGlobalAlternativesForAircraft(aircraft.callsign, transcript);
      }
    }

    playErrorSound();
    sendMessage(`Could not identify callsign ${callsign}`, '', 'system');
  }

  function getCallsign(transcript: string) {
    return transcript.split(' ')[0];
  }

  function matchRequestToTranscript(
    request: AircraftRequest,
    transcript: string,
    callsign: string
  ) {
    const keywords = REQUEST_KEYWORDS[request.requestType];

    if (keywordsMatchTranscript(keywords, transcript)) {
      // sendMessage(transcript, 'PWM_GND', 'self');
      return completeRequest(callsign, true);
    }

    if (keywords.alternatives) {
      for (const alternative of keywords.alternatives) {
        if (keywordsMatchTranscript(alternative, transcript)) {
          if (alternative.aircraftResponse && alternative.aircraftResponse.length > 0) {
            return sendMessage(alternative.aircraftResponse, callsign, 'radio');
          }
          return;
        }
      }
    }

    sendMessage(`Say again for ${callsign}?`, callsign, 'radio');
  }

  function checkGlobalAlternativesForAircraft(callsign: string, transcript: string): boolean {
    for (const alternative of GLOBAL_ALTERNATIVES) {
      if (alternative.aircraftResponse && keywordsMatchTranscript(alternative, transcript)) {
        sendMessage(alternative.aircraftResponse, callsign, 'radio');
        return true;
      }
    }
    sendMessage(`I didn't understand that`, callsign, 'radio');
    return false;
  }

  function keywordsMatchTranscript(keywords: Keywords, transcript: string) {
    for (const keyword of keywords.keywords) {
      if (!transcript.includes(keyword)) {
        return false;
      }
    }

    if (keywords.atLeastOneOf) {
      const atLeastOneMatch = keywords.atLeastOneOf.find((phrase) => transcript.includes(phrase));
      if (!atLeastOneMatch) {
        return false;
      }
    }
    return true;
  }

  function callsignsApproximatelyMatch(actualCallsign: string, voiceToTextCallsign: string) {
    if (actualCallsign.startsWith('N')) {
      return matchNNumberCallsigns(actualCallsign, voiceToTextCallsign);
    }
    return matchAirlineCallsigns(actualCallsign, voiceToTextCallsign);
  }

  function matchAirlineCallsigns(actualCallsign: string, voiceToTextCallsign: string) {
    if (voiceToTextCallsign.length < 5) {
      return false;
    }
    if (actualCallsign.substring(0, 3) !== voiceToTextCallsign.substring(0, 3)) {
      return false;
    }
    let characterMatchCount = 0;
    for (let i = 3; i < actualCallsign.length && i < voiceToTextCallsign.length; i++) {
      if (actualCallsign.charAt(i) === voiceToTextCallsign.charAt(i)) {
        characterMatchCount++;
      }
    }
    return characterMatchCount >= 3;
  }

  function matchNNumberCallsigns(actualCallsign: string, voiceToTextCallsign: string) {
    let characterMatchCount = 0;
    for (let i = 0; i < actualCallsign.length && i < voiceToTextCallsign.length; i++) {
      if (actualCallsign.charAt(i) === voiceToTextCallsign.charAt(i)) {
        characterMatchCount++;
      }
    }
    if (characterMatchCount >= 5) {
      return true;
    }

    if (voiceToTextCallsign.length < actualCallsign.length) {
      characterMatchCount = 0;
      for (let i = 1; i < voiceToTextCallsign.length; i++) {
        if (
          actualCallsign.charAt(actualCallsign.length - i) ===
          voiceToTextCallsign.charAt(voiceToTextCallsign.length - i)
        ) {
          characterMatchCount++;
        }
      }
    }
    return characterMatchCount >= 3;
  }

  const value: SpeechInterpretationDetails = { interpretNewSpeech };

  return (
    <SpeechInterpretationContext.Provider value={value}>
      {children}
    </SpeechInterpretationContext.Provider>
  );
}
