import { createContext, useContext } from 'react';
import type { MessagesDetails } from '../types/common';

export const MessagesContext = createContext<MessagesDetails>(
  {} as MessagesDetails
);

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within MessagesContext');
  }

  return context;
}
