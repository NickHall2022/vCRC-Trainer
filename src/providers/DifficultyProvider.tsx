import { type ReactNode } from "react";
import { useImmer } from "use-immer";
import type { DifficultyDetails } from "../types/common";
import { DifficultyContext } from "../hooks/useDifficulty";


export function DifficultyProvider({ children }: { children: ReactNode }){
    const [difficulty, setDifficulty] = useImmer<number>(1);

    const value: DifficultyDetails = {
        difficulty,
        setDifficulty
    }

    return <DifficultyContext.Provider value={value}>{children}</DifficultyContext.Provider>
}
