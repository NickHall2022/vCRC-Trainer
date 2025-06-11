import { useState, type ReactNode } from "react";
import type { FlightPlan } from "../types/common";
import { FlightPlanContext } from "../hooks/useFlightPlans";
import { FLIGHT_PLANS, makeEmptyFlightPlan } from "../assets/flightPlans";
import { useImmer } from "use-immer";

export function FlightPlanProvider({ children }: { children: ReactNode }){
    const [selectedFlightPlan, setSelectedFlightPlan] = useState<FlightPlan | undefined>(undefined)

    const [flightPlans, setFlightPlans] = useImmer<FlightPlan[]>(FLIGHT_PLANS);

    function getFlightByCallsign(callsign: string){
        const flightPlan = flightPlans.find(flightPlan => flightPlan.callsign === callsign);
        if(flightPlan){
            return flightPlan
        }
        return { ...makeEmptyFlightPlan(), callsign };
    }

    function amendFlightPlan(amendedFlightPlan: FlightPlan){
        setFlightPlans((draft) => {
            const replaceIndex = draft.findIndex(flightPlan => flightPlan.callsign === amendedFlightPlan.callsign);
            if(replaceIndex !== -1){
                draft[replaceIndex] = amendedFlightPlan;
            }
        })
    }

    const value = {
        flightPlans, 
        getFlightByCallsign,
        selectedFlightPlan,
        setSelectedFlightPlan: (callsign: string) => setSelectedFlightPlan(getFlightByCallsign(callsign)),
        amendFlightPlan
    }

    return <FlightPlanContext.Provider value={value}>{children}</FlightPlanContext.Provider>
}