import { useState, type ReactNode } from "react";
import type { FlightPlan, FlightStatus } from "../types/common";
import { FlightPlanContext } from "../hooks/useFlightPlans";
import { makeEmptyFlightPlan, makeNewFlight } from "../utils/flightPlans";
import { useImmer } from "use-immer";
import { usePrefRoutes } from "../hooks/usePrefRoutes";
import { useParkingSpots } from "../hooks/useParkingSpots";

export function FlightPlanProvider({ children }: { children: ReactNode }){
    const { reserveSpot } = useParkingSpots();

    const [selectedFlightPlan, setSelectedFlightPlan] = useState<FlightPlan | undefined>(undefined)
    const prefRoutes = usePrefRoutes();

    const [flightPlans, setFlightPlans] = useImmer<FlightPlan[]>([]);

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

    function setNextRequestTime(callsign: string, canSendRequestTime: number, timer: number){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].canSendRequestTime = timer + canSendRequestTime;
            }
        });
    }

    function setPlanePosition(callsign: string, x: number, y: number, angle?: number){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].positionX = x;
                draft[modifyIndex].positionY = y;
                if(angle){
                    draft[modifyIndex].rotation = angle;
                }
            }
        });
    }

    function setTaxiwayNodeId(callsign: string, id: string){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].taxiwayNodeId = id;
            }
        });
    }

    function setPlaneStatus(callsign: string, status: FlightStatus, timer: number){
        setFlightPlans((draft) => {
            const modifyIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(modifyIndex !== -1){
                draft[modifyIndex].status = status;
                draft[modifyIndex].statusChangedTime = timer;
            }
        });
    }

    function deleteFlightPlan(callsign: string){
        setFlightPlans((draft) => {
            const deleteIndex = draft.findIndex(flightPlan => flightPlan.callsign === callsign);
            if(deleteIndex !== -1){
                draft.splice(deleteIndex, 1);
            }
        });
    }

    function spawnNewFlight(): FlightPlan | undefined {
        const random = Math.random();
        const flightType = random < 0.5 ? "airline" : (random < 0.7 ? "TEC" : "ga");

        const parkingSpot = reserveSpot(flightType);
        if(parkingSpot){
            const newFlightPlan = makeNewFlight(parkingSpot, prefRoutes);
            setFlightPlans(draft => {
                draft.push(newFlightPlan);
            })
            return newFlightPlan;
        }
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
        setPlaneStatus,
        deleteFlightPlan,
        spawnNewFlight,
        setTaxiwayNodeId
    }

    return <FlightPlanContext.Provider value={value}>{children}</FlightPlanContext.Provider>
}