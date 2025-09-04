import { createContext, useContext } from 'react';
import type { StripsDetails } from '../types/common';

export const StripsContext = createContext<StripsDetails>({} as StripsDetails);

export function useStrips() {
  const context = useContext(StripsContext);
  if (!context) {
    throw new Error('useStrips must be used within StripsContext');
  }

  return context;
}
