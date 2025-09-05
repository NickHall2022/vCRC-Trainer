import { createContext, useContext } from 'react';

export type SpeechInterpretationDetails = {
  interpretNewSpeech: (transcript: string) => void;
};

export const SpeechInterpretationContext = createContext<SpeechInterpretationDetails>(
  {} as SpeechInterpretationDetails
);

export function useSpeechInterpretation() {
  const context = useContext(SpeechInterpretationContext);
  if (!context) {
    throw new Error('useSpeechInterpretation must be used within SpeechInterpretationContext');
  }

  return context;
}
