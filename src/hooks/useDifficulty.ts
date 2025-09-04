import { createContext, useContext } from 'react';
import type { DifficultyDetails } from '../types/common';

export const DifficultyContext = createContext<DifficultyDetails>(
  {} as DifficultyDetails
);

export function useDifficulty() {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error('useDifficulty must be used within DifficultyContext');
  }

  return context;
}
