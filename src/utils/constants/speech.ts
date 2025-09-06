import type { Aircraft, Keywords, RequestType } from '../../types/common';
import { PHONETIC_ATIS } from './alphabet';

export const SPEECH_AVAILABLE = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export const DEFAULT_PTT_KEY = 'q';

export const REQUEST_KEYWORDS: Record<RequestType, Keywords> = {
  clearanceIFR: {
    keywords: [
      { phrase: 'clear', missingPhraseResponse: 'clearance limit' },
      { phrase: 'maintain', missingPhraseResponse: 'altitude' },
      { phrase: '119', missingPhraseResponse: 'departure frequency' },
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
  readbackIFR: { keywords: [{ phrase: 'readback' }] },
  clearanceVFR: {
    keywords: [
      { phrase: 'maintain', missingPhraseResponse: 'altitude' },
      { phrase: '119', missingPhraseResponse: 'departure frequency' },
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
  pattern: {
    keywords: [
      { phrase: 'taxi' },
      { phrase: 'runway 29', missingPhraseResponse: 'departure runway' },
      { phrase: 'squawk', missingPhraseResponse: 'squawk' },
    ],
    alternatives: [
      {
        keywords: [],
        atLeastOneOf: ['advise', 'ready'],
        aircraftResponse: 'Ready to taxi',
      },
    ],
  },
  handoff: {
    keywords: [
      { phrase: 'contact tower' },
      { phrase: '120', missingPhraseResponse: 'tower frequency' },
    ],
  },
};

export const GLOBAL_ALTERNATIVES = function (aircraft: Aircraft): Keywords[] {
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
