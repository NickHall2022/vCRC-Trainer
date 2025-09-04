import { createContext, useContext } from 'react';
import type { SimulationDetails } from '../types/common';

export const SimulationContext = createContext<SimulationDetails>(
  {} as SimulationDetails
);

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationContext');
  }

  return context;
}
