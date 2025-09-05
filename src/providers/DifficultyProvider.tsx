import { type ReactNode } from 'react';
import { useImmer } from 'use-immer';
import type { DifficultyDetails } from '../types/common';
import { DifficultyContext } from '../hooks/useDifficulty';

export function DifficultyProvider({ children }: { children: ReactNode }) {
  const [difficulty, setDifficulty] = useImmer<number>(
    Number(localStorage.getItem('difficulty')) || 1
  );

  function updateDifficulty(newDifficulty: number) {
    setDifficulty(newDifficulty);
    localStorage.setItem('difficulty', newDifficulty.toString());
  }

  const value: DifficultyDetails = {
    difficulty,
    updateDifficulty,
  };

  return <DifficultyContext.Provider value={value}>{children}</DifficultyContext.Provider>;
}
