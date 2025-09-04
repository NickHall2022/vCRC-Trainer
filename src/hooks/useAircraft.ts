import { createContext, useContext } from 'react';
import type { AircraftDetails } from '../types/common';

export const AircraftContext = createContext<AircraftDetails>(
  {} as AircraftDetails
);

export function useAircraft() {
  const context = useContext(AircraftContext);
  if (!context) {
    throw new Error('useAircraft must be used within AircraftContext');
  }

  return context;
}
