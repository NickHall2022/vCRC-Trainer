import { type ReactNode } from 'react';
import {
  SpeechInterpretationContext,
  type SpeechInterpretationDetails,
} from '../hooks/useSpeechInterpretation';
import { useSimulation } from '../hooks/useSimulation';
import useSound from 'use-sound';
import { useMessages } from '../hooks/useMessages';
import type { Aircraft, FlightStatus, RequestType } from '../types/common';
import { useAircraft } from '../hooks/useAircraft';
import { phoneticizeString } from '../utils/flightPlans';
import { PHONETIC_ATIS } from '../utils/constants/alphabet';

type Keywords = {
  keywords: { phrase: string; missingPhraseResponse?: string }[];
  atLeastOneOf?: string[];
  alternatives?: Keywords[];
  aircraftResponse?: string;
  requiredStatus?: FlightStatus;
};

const REQUEST_KEYWORDS: Record<RequestType, Keywords> = {
  clearanceIFR: {
    keywords: [
      { phrase: 'clear', missingPhraseResponse: 'clearance limit' },
      { phrase: 'maintain', missingPhraseResponse: 'altitude' },
      { phrase: 'departure', missingPhraseResponse: 'departure frequency' },
      { phrase: 'squawk', missingPhraseResponse: 'squawk' },
    ],
    alternatives: [
      {
        keywords: [],
        atLeastOneOf: ['request', 'standby'],
        aircraftResponse: '',
      },
      {
        keywords: [],
        atLeastOneOf: ['advise', 'ready', 'copy'],
        aircraftResponse: 'Ready to copy',
      },
    ],
  },
  readbackIFR: { keywords: [{ phrase: 'readback correct' }] },
  clearanceVFR: {
    keywords: [
      { phrase: 'maintain', missingPhraseResponse: 'altitude' },
      { phrase: 'departure', missingPhraseResponse: 'departure frequency' },
      { phrase: 'squawk', missingPhraseResponse: 'squawk' },
    ],
  },
  readbackVFR: {
    keywords: [
      { phrase: 'taxi' },
      { phrase: 'runway 29', missingPhraseResponse: 'departure runway' },
    ],
    alternatives: [
      {
        keywords: [],
        atLeastOneOf: ['advise', 'ready'],
        aircraftResponse: 'Ready to taxi',
      },
    ],
  },
  pushback: { keywords: [{ phrase: 'push' }], atLeastOneOf: ['approved', 'discretion'] },
  taxi: {
    keywords: [{ phrase: 'taxi' }, { phrase: 'runway 29', missingPhraseResponse: 'runway' }],
  },
  pattern: {
    keywords: [
      { phrase: 'taxi' },
      { phrase: 'runway  29', missingPhraseResponse: 'departure runway' },
      { phrase: 'squawk', missingPhraseResponse: 'squawk' },
    ],
  },
  handoff: {
    keywords: [
      { phrase: 'contact tower' },
      { phrase: '120', missingPhraseResponse: 'tower frequency' },
    ],
  },
};

const GLOBAL_ALTERNATIVES = function (aircraft: Aircraft): Keywords[] {
  return [
    {
      keywords: [{ phrase: 'radio' }, { phrase: 'check' }],
      aircraftResponse: 'I read you loud and clear',
    },
    {
      keywords: [{ phrase: 'aircraft type' }],
      aircraftResponse: `Our aircraft is type ${aircraft.actualAircraftType}`,
    },
    {
      keywords: [{ phrase: 'verify' }],
      atLeastOneOf: ['atis', 'information'],
      aircraftResponse: `We have information ${PHONETIC_ATIS}`,
    },
    {
      keywords: [{ phrase: 'confirm' }],
      atLeastOneOf: ['atis', 'information'],
      aircraftResponse: `We have information ${PHONETIC_ATIS}`,
    },
    {
      keywords: [{ phrase: 'say' }],
      atLeastOneOf: ['atis', 'information'],
      aircraftResponse: `We have information ${PHONETIC_ATIS}`,
    },
  ];
};

export function SpeechInterpretatonProvider({ children }: { children: ReactNode }) {
  const { requests, completeRequest, setRequests } = useSimulation();
  const { aircrafts } = useAircraft();
  const { sendMessage } = useMessages();
  const [playErrorSound] = useSound('Error.wav');

  function interpretNewSpeech(transcript: string) {
    sendMessage(transcript, 'PWM_GND', 'self');

    const callsign = getCallsign(transcript);
    for (const aircraft of aircrafts) {
      if (callsignsApproximatelyMatch(aircraft.callsign, callsign)) {
        if (aircraft.status.includes('handed') || aircraft.status === 'departed') {
          playErrorSound();
          sendMessage(`Aircraft ${callsign} is no longer on your frequency`, '', 'system');
        }
        return matchAircraftToTranscript(aircraft, transcript);
      }
    }

    playErrorSound();
    sendMessage(`Could not identify callsign ${callsign}`, '', 'system');
  }

  function getCallsign(transcript: string) {
    return transcript.split(' ')[0];
  }

  function matchAircraftToTranscript(aircraft: Aircraft, transcript: string) {
    const callsign = aircraft.callsign;
    if (checkGlobalAlternativesForAircraft(aircraft, transcript)) {
      return;
    }

    const request = requests.find((request) => request.callsign === callsign);
    if (request) {
      const keywords = REQUEST_KEYWORDS[request.requestType];

      if (keywordsMatchTranscript(keywords, transcript)) {
        return completeRequest(callsign, true);
      }

      if (keywords.alternatives) {
        for (const alternative of keywords.alternatives) {
          if (keywordsMatchTranscript(alternative, transcript)) {
            if (alternative.aircraftResponse && alternative.aircraftResponse.length > 0) {
              return sendMessage(
                alternative.aircraftResponse,
                callsign,
                'radio',
                `${phoneticizeString(callsign)} ${alternative.aircraftResponse}`
              );
            }
            return;
          }
        }
      }

      let matchedKeywords = request.previouslyMatchedKeywords?.slice() || [];
      console.log(matchedKeywords);
      let missingPhraseResponses = [];
      for (const keyword of keywords.keywords) {
        if (transcript.includes(keyword.phrase)) {
          appendIfNotDuplicate(matchedKeywords, keyword.phrase);
        } else if (!matchedKeywords.includes(keyword.phrase)) {
          if (keyword.missingPhraseResponse) {
            missingPhraseResponses.push(keyword.missingPhraseResponse);
          }
        }
      }

      const atLeastOneMatch =
        !keywords.atLeastOneOf ||
        keywords.atLeastOneOf.find((phrase) => transcript.includes(phrase));

      if (matchedKeywords.length === keywords.keywords.length && atLeastOneMatch) {
        return completeRequest(callsign, true);
      } else {
        setRequests((draft) => {
          const requestToChange = draft.find((item) => item.callsign === aircraft.callsign);
          if (requestToChange) {
            requestToChange.previouslyMatchedKeywords = [...matchedKeywords];
          }
        });
        if (missingPhraseResponses.length > 0) {
          const responseMessage = joinMissingPhraseResponses(missingPhraseResponses);
          sendMessage(
            responseMessage,
            callsign,
            'radio',
            `${phoneticizeString(callsign)} ${responseMessage}`
          );
          return;
        }
      }
    }

    sendMessage(
      `I didn't understand that`,
      callsign,
      'radio',
      `${phoneticizeString(callsign)} I didn't understand that`
    );
  }

  function checkGlobalAlternativesForAircraft(aircraft: Aircraft, transcript: string): boolean {
    for (const alternative of GLOBAL_ALTERNATIVES(aircraft)) {
      if (alternative.aircraftResponse && keywordsMatchTranscript(alternative, transcript)) {
        sendMessage(
          alternative.aircraftResponse,
          aircraft.callsign,
          'radio',
          `${phoneticizeString(aircraft.callsign)} ${alternative.aircraftResponse}`
        );
        return true;
      }
    }
    return false;
  }

  function keywordsMatchTranscript(keywords: Keywords, transcript: string) {
    for (const keyword of keywords.keywords) {
      if (!transcript.includes(keyword.phrase)) {
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

  function appendIfNotDuplicate<T>(items: T[], newItem: T) {
    if (!items.includes(newItem)) {
      items.push(newItem);
    }
  }

  function joinMissingPhraseResponses(missingPhraseResponses: string[]) {
    if (missingPhraseResponses.length > 1) {
      missingPhraseResponses[missingPhraseResponses.length - 1] =
        `or ${missingPhraseResponses[missingPhraseResponses.length - 1]}`;
    }
    const joinedPhrases = missingPhraseResponses.join(', ');
    return `I didn't catch the ${joinedPhrases}`;
  }

  const value: SpeechInterpretationDetails = { interpretNewSpeech };

  return (
    <SpeechInterpretationContext.Provider value={value}>
      {children}
    </SpeechInterpretationContext.Provider>
  );
}
