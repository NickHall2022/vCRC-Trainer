import { createContext, useContext } from 'react';
import type { MistakeDetails } from '../types/common';

export const MistakeContext = createContext<MistakeDetails>({} as MistakeDetails);

export function useMistakes() {
  const context = useContext(MistakeContext);
  if (!context) {
    throw new Error('useMistakes must be used within MistakeContext');
  }

  return context;
}
