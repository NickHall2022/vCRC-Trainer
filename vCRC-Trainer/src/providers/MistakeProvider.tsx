import { type ReactNode } from "react";
import { useImmer } from "use-immer";
import type { Mistake, MistakeDetails, MistakeType } from "../types/common";
import { MistakeContext } from "../hooks/useMistakes";


export function DifficultyProvider({ children }: { children: ReactNode }){
    const [mistakes, setMistakes] = useImmer<Mistake[]>([]);

    function addMistake(type: MistakeType){
        setMistakes(draft => {
            draft.push({
                type
            })
        })
    }

    const value: MistakeDetails = {
        mistakes,
        addMistake
    }

    return <MistakeContext.Provider value={value}>{children}</MistakeContext.Provider>
}
