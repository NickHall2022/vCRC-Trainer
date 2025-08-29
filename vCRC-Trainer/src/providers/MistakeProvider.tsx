import { type ReactNode } from "react";
import { useImmer } from "use-immer";
import type { FlightPlan, Mistake, MistakeDetails, MistakeType } from "../types/common";
import { MistakeContext } from "../hooks/useMistakes";
import { useFlightPlans } from "../hooks/useFlightPlans";
import { DEST_TO_DIRECTION_MAP, HIGH_EAST_ALT, HIGH_WEST_ALT, jetTypes, TEC_EAST_ALT, TEC_WEST_ALT } from "../utils/flightPlans";
import { usePrefRoutes } from "../hooks/usePrefRoutes";


export function MistakeProvider({ children }: { children: ReactNode }){
    const [mistakes, setMistakes] = useImmer<Mistake[]>([]);
    const { flightPlans } = useFlightPlans();
    const prefRoutes = usePrefRoutes();

    console.log(mistakes)

    function addMistake(type: MistakeType, details?: string, secondaryDetails?: string){
        setMistakes(draft => {
            draft.push({
                type,
                details,
                secondaryDetails
            })
        })
    }

    function reviewClearance(callsign: string){
        const flightPlan = flightPlans.find(flight => flight.callsign === callsign);
        if(!flightPlan){
            return;
        }
        validateAltitude(flightPlan);
        validateEquipment(flightPlan);
        validateRoute(flightPlan);
    }

    function validateAltitude(flightPlan: FlightPlan){
        const regex = /\d{3}/;
        if(!regex.test(flightPlan.altitude) || flightPlan.altitude.length !== 3 || Number(flightPlan.altitude) % 10 !== 0){
            return addMistake("IFRAltFormat", flightPlan.altitude);
        }

        const direction = DEST_TO_DIRECTION_MAP[flightPlan.destination];
        
        if(direction){
            if(direction === "west"){
                if((flightPlan.routeType === "H" && HIGH_WEST_ALT.indexOf(flightPlan.altitude) === -1) || (flightPlan.routeType === "TEC" && TEC_WEST_ALT.indexOf(flightPlan.altitude) === -1)){
                    return addMistake("badIFRAlt", flightPlan.altitude, flightPlan.destination)
                }
            } else if((flightPlan.routeType === "H" && HIGH_EAST_ALT.indexOf(flightPlan.altitude) === -1) || (flightPlan.routeType === "TEC" && TEC_EAST_ALT.indexOf(flightPlan.altitude) === -1)){
                return addMistake("badIFRAlt", flightPlan.altitude, flightPlan.destination)
            }
        }
    }

    function validateEquipment(flightPlan: FlightPlan){
        if(jetTypes.indexOf(flightPlan.actualAircraftType) > -1 && flightPlan.equipmentCode !== "L"){
            addMistake("badEquipment", flightPlan.equipmentCode, flightPlan.actualAircraftType);
        }
    }

    function validateRoute(flightPlan: FlightPlan){
        const routesToDestination = prefRoutes.highRoutes.concat(prefRoutes.tecRoutes).filter(route => `K${route.destination}` === flightPlan.destination);
        
        if(routesToDestination.length === 0){
            return;
        }

        if(!routesToDestination.find(route => route.route.substring(4, route.route.length - 4) === flightPlan.route)){
            addMistake("badRoute", flightPlan.route, flightPlan.destination);
        }
    }

    const value: MistakeDetails = {
        mistakes,
        addMistake,
        reviewClearance
    }

    return <MistakeContext.Provider value={value}>{children}</MistakeContext.Provider>
}
