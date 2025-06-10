import { createContext, useContext } from "react";
import type { FlightPlanDetails } from "../types/common";

export const FlightPlanContext = createContext<FlightPlanDetails>({} as FlightPlanDetails)

export function useFlightPlans(){
    const context = useContext(FlightPlanContext);
    if(!context){
        throw new Error("useFlightPlans must be used within FlightPlanContext");
    }

    return context;
}
