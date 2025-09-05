import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export type SpeechDetails = {
  setVoiceSwitchEnabled: Dispatch<SetStateAction<boolean>>;
};

export const SpeechContext = createContext<SpeechDetails>({} as SpeechDetails);

export function useSpeech() {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within SpeechContext');
  }

  return context;
}
