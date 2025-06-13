import { useState, type ReactNode } from "react";
import type { FlightPlan, FlightStatus } from "../types/common";
import { FlightPlanContext } from "../hooks/useFlightPlans";
import { FLIGHT_PLANS, makeEmptyFlightPlan } from "../utils/flightPlans";
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

    function removeFirstRequest(callsign: string){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].requests.splice(0, 1);
            }
        });
    }

    function setNextRequestTime(callsign: string, canSendRequestTime: number){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].canSendRequestTime = Date.now() + canSendRequestTime;
            }
        });
    }

    function setPlanePosition(callsign: string, x: number, y: number){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].positionX = x;
                draft[modifyIndex].positionY = y;
            }
        });
    }

    function setPlaneStatus(callsign: string, status: FlightStatus){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].status = status;
            }
        });
    }

    const value = {
        flightPlans, 
        getFlightByCallsign,
        selectedFlightPlan,
        setSelectedFlightPlan: (callsign: string) => setSelectedFlightPlan(getFlightByCallsign(callsign)),
        amendFlightPlan,
        removeFirstRequest,
        setNextRequestTime,
        setPlanePosition,
        setPlaneStatus
    }

    return <FlightPlanContext.Provider value={value}>{children}</FlightPlanContext.Provider>
}