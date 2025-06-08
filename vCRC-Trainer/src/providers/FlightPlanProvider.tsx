import { useState, type ReactNode } from "react";
import type { FlightPlan } from "../types/flightPlan";
import { FlightPlanContext } from "../hooks/useFlightPlans";
import { FLIGHT_PLANS } from "../assets/flightPlans";

export function FlightPlanProvider({ children }: { children: ReactNode }){
    const [selectedFlightPlan, setSelectedFlightPlan] = useState<FlightPlan | undefined>(undefined)

    const [flightPlans, setFlightPlans] = useState<FlightPlan[]>(FLIGHT_PLANS);

    function getFlightByCallsign(callsign: string){
        return flightPlans.find(flightPlan => flightPlan.callsign === callsign);
    }

    function amendFlightPlan(amendedFlightPlan: FlightPlan){
        setFlightPlans((prev) => {
            const result = prev.slice();
            const replaceIndex = prev.findIndex(flightPlan => flightPlan.callsign === amendedFlightPlan.callsign);
            if(replaceIndex !== -1){
                result[replaceIndex] = amendedFlightPlan;
            }
            return result;
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