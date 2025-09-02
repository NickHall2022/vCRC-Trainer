import { createContext, useContext } from "react";
import type { PrefRouteDetails } from "../types/common";

export const PrefRouteContext = createContext<PrefRouteDetails>({} as PrefRouteDetails)

export function usePrefRoutes(){
    const context = useContext(PrefRouteContext);
    if(!context){
        throw new Error("usePrefRoutes must be used within PrefRouteContext");
    }

    return context;
}
