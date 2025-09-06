import { useEffect, useState, type ReactNode } from 'react';
import { useMessages } from '../hooks/useMessages';
import { AIRLINES } from '../utils/constants/aircraftTypes';
import { PHONETIC_ALPHABET_REVERSE } from '../utils/constants/alphabet';
import { SpeechContext, type SpeechDetails } from '../hooks/useSpeech';
import useSound from 'use-sound';
import { useSpeechInterpretation } from '../hooks/useSpeechInterpretation';
import { useSimulation } from '../hooks/useSimulation';
import { DEFAULT_PTT_KEY } from '../utils/constants/speech';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition && new SpeechRecognition();
if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [voiceSwitchEnabled, setVoiceSwitchEnabled] = useState(true);

  const { interpretNewSpeech } = useSpeechInterpretation();
  const { pushToTalkActive, setPushToTalkActive, paused } = useSimulation();

  const { sendMessage } = useMessages();
  const [playErrorSound] = useSound('Error.wav');

  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = compileTranscript(event.results);

      recognition.onend = () => {
        if (transcript != '') {
          triggerOutput(transcript);
        }
      };
    };

    recognition.onerror = () => {
      recognition.stop();
    };

    recognition.onstart = () => {
      recognition.onend = () => {};
    };

    document.addEventListener('keydown', handlePushToTalk);
    document.addEventListener('keyup', stopSpeaking);

    return () => {
      document.removeEventListener('keydown', handlePushToTalk);
      document.removeEventListener('keyup', stopSpeaking);
    };
  });

  function handlePushToTalk(event: KeyboardEvent) {
    if (
      !paused &&
      !pushToTalkActive &&
      event.code === (localStorage.getItem('pttButton') || DEFAULT_PTT_KEY)
    ) {
      if (voiceSwitchEnabled) {
        recognition.start();
      } else {
        playErrorSound();
        sendMessage('TX is disabled in your voice switch', '', 'system');
      }
      setPushToTalkActive(true);
    }
  }

  function stopSpeaking(event: KeyboardEvent) {
    if (event.code === (localStorage.getItem('pttButton') || DEFAULT_PTT_KEY)) {
      setPushToTalkActive(false);
      setTimeout(() => recognition.stop(), 500);
    }
  }

  function compileTranscript(results: SpeechRecognitionResultList) {
    let output = '';
    for (let i = 0; i < results.length; i++) {
      output += results[i][0].transcript + ' ';
    }
    return sanitizeTranscript(output);
  }

  function sanitizeTranscript(transcript: string) {
    console.debug(transcript);
    transcript = transcript
      .toLowerCase()
      .replaceAll(',', '')
      .replaceAll('. ', ' ')
      .replaceAll('/', '')
      .replaceAll('?', '')
      .replaceAll(':', '')
      .replaceAll('-', '')
      .replaceAll('9 or', '9')
      .replaceAll('9 and', '9')
      .replaceAll('niner', '9')
      .replaceAll(' 4th', '4')
      .replaceAll(' 5th', '5')
      .replaceAll(' 6th', '6')
      .replaceAll(' 7th', '7')
      .replaceAll(' 8th', '8')
      .replaceAll(' 9th', '9')
      .replaceAll('runway to 9', 'runway 29')
      .replaceAll('runway 2 9', 'runway 29')
      .replaceAll('via far', 'VFR')
      .replaceAll('via our', 'VFR')
      .replaceAll('via power', 'VFR')
      .replaceAll('fiat bar', 'VFR')
      .replaceAll('november ', 'N')
      .replaceAll('remember ', 'N')
      .replaceAll('charley', 'charlie')
      .replaceAll("Charlie's", 'charlie')
      .replaceAll('gold', 'golf')
      .replaceAll('minton', 'maintain')
      .replaceAll('maintained', 'maintain')
      .replaceAll('maintaining', 'maintain')
      .replaceAll('pushed back', 'pushback')
      .replaceAll('read back', 'readback')
      .replaceAll('read that', 'readback')
      .replaceAll('reed back', 'readback')
      .replaceAll('readback act', 'readback correct')
      .replaceAll('is that correct', 'readback correct')
      .replaceAll('remake', 'readback')
      .replaceAll('read by', 'readback')
      .replaceAll('rebecca', 'readback')
      .replaceAll('viled', 'filed')
      .replaceAll('biled', 'filed')
      .replaceAll('bile', 'filed')
      .replaceAll('file ', 'filed ')
      .replaceAll(' tao', ' tower')
      .replaceAll('hour', ' tower')
      .replaceAll(' tau', ' tower')
      .replaceAll('texaco', 'taxi')
      .replaceAll('tax review', 'taxi via')
      .replaceAll('tax ', 'taxi ')
      .replaceAll('text you', 'taxi via')
      .replaceAll('text me', 'taxi via')
      .replaceAll('talks', 'taxi via')
      .replaceAll('text to be', 'taxi via')
      .replaceAll('tuxedo', 'taxi via')
      .replaceAll('texavia', 'taxi via')
      .replaceAll('taxavia', 'taxi via')
      .replaceAll('texivia', 'taxi via')
      .replaceAll('taxivio', 'taxi via')
      .replaceAll('tech cvi', 'taxi via')
      .replaceAll('texevia', 'taxi via')
      .replaceAll('tekstovia', 'taxi via')
      .replaceAll('texty', 'taxi')
      .replaceAll('texted', 'taxi')
      .replaceAll('out of blow', 'at or below')
      .replaceAll('radio cha', 'radio check')
      .replaceAll('radio shack', 'radio check')
      .replaceAll('radioshack', 'radio check')
      .replaceAll('limousine', 'ls')
      .replaceAll(' chop', ' check')
      .replaceAll(' squad', ' squawk')
      .replaceAll('squawks', 'squawk')
      .replaceAll(' score', ' squawk')
      .replaceAll(' scorp', ' squawk')
      .replaceAll('squat', ' squawk')
      .replaceAll(' walk', ' squawk')
      .replaceAll(' guac', ' squawk')
      .replaceAll(' coffee', ' copy')
      .replaceAll('run by', 'runway')
      .replaceAll('run my', 'runway')
      .replaceAll('run away', 'runway')
      .replaceAll('roman', 'runway')
      .replaceAll('runaway', 'runway')
      .replaceAll('rampers', 'ramp is')
      .replaceAll('advised', 'advise')
      .replaceAll('advisory', 'advise ready')
      .replaceAll('advisor', 'advise ready')
      .replaceAll('adviser', 'advise')
      .replaceAll('right directors', 'radar vectors')
      .replaceAll('rate of rectors', 'radar vectors')
      .replaceAll(' mic ', 'm')
      .replaceAll('crack', 'correct')
      .replaceAll('clear ', 'cleared ')
      .replaceAll('noble', 'nuble')
      .replaceAll('be the', 'via')
      .replaceAll('is filed', 'as filed')
      .replaceAll('has filed', 'as filed')
      .replaceAll('fox trot', 'f')
      .replaceAll('foxtr ', 'f ')
      .replaceAll('fox ', 'f ')
      .replaceAll('funk straut', 'f')
      .replaceAll('funk strout', 'f')
      .replaceAll('hello', '')
      .replaceAll('airlines', 'airline')
      .replaceAll('crowned', 'ground')
      .replaceAll('cough', 'call for')
      .replaceAll('go back', 'q')
      .replaceAll('119 are', '119')
      .replaceAll('119 .75', '119.75')
      .replaceAll('120.9er', '120.9')
      .replaceAll('went to 0', '120')
      .replaceAll('xray', 'x')
      .replaceAll('yankees', 'y')
      .replaceAll('zero', '0')
      .replaceAll('adis', 'atis')
      .replaceAll('edith', 'atis')
      .replaceAll('it is', 'atis')
      .trim();

    if (transcript.startsWith('KR')) {
      transcript = transcript.replace('KR', 'care');
    }
    if (transcript.startsWith('number ')) {
      transcript = transcript.replace('number ', 'N');
    }
    Object.keys(PHONETIC_ALPHABET_REVERSE).forEach((letter) => {
      transcript = transcript.replaceAll(letter, PHONETIC_ALPHABET_REVERSE[letter]);
    });
    transcript = formatCallsign(transcript);
    return transcript;
  }

  function formatCallsign(transcript: string) {
    if (
      transcript.length >= 2 &&
      transcript.charAt(0).toLowerCase() === 'd' &&
      transcript.charAt(1) !== ' ' &&
      !Number.isNaN(Number(transcript.charAt(1)))
    ) {
      if (transcript.charAt(0) === 'd') {
        transcript = transcript.replace('d', 'DAL');
      } else if (transcript.charAt(0) === 'D') {
        transcript = transcript.replace('D', 'DAL');
      }
    } else {
      for (const airline of Object.keys(AIRLINES)) {
        if (transcript.startsWith(airline)) {
          transcript = transcript.replace(airline, AIRLINES[airline]).replace(' ', '');
          break;
        }
      }
    }

    const splitTranscript = transcript.split(' ');
    if (splitTranscript.length > 0) {
      splitTranscript[0] = splitTranscript[0].toUpperCase();
    }

    let numStrayChunksToMerge = 0;
    if (splitTranscript[0].startsWith('N')) {
      const CALLSIGN_LENGTH = 6;
      let numLettersFound = splitTranscript[0].length;
      let i = 1;

      while (i < splitTranscript.length && numLettersFound < CALLSIGN_LENGTH) {
        if (splitTranscript[i].length + numLettersFound > CALLSIGN_LENGTH) {
          break;
        }
        numStrayChunksToMerge++;
        numLettersFound += splitTranscript[i].length;
        splitTranscript[i] = splitTranscript[i].toUpperCase();
        i++;
      }
    }

    transcript = splitTranscript.join(' ');

    for (let j = 0; j < numStrayChunksToMerge; j++) {
      transcript = transcript.replace(' ', '');
    }

    return transcript;
  }

  function triggerOutput(transcript: string) {
    const lowerCasedTranscript = transcript.toLowerCase();
    if (
      lowerCasedTranscript.endsWith('disregard') ||
      lowerCasedTranscript.endsWith('never mind') ||
      lowerCasedTranscript.endsWith('stand by') ||
      lowerCasedTranscript.endsWith('standby')
    ) {
      return;
    }
    interpretNewSpeech(transcript);
  }

  const value: SpeechDetails = {
    setVoiceSwitchEnabled,
  };

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}
