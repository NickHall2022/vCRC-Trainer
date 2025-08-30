import { useState, type ReactNode } from "react";
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
    const [newMistake, setNewMistake] = useState(false);

    function addMistake(type: MistakeType, details?: string, secondaryDetails?: string){
        setMistakes(draft => {
            draft.push({
                type,
                details,
                secondaryDetails
            })
        });
        setNewMistake(true);
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

    function reviewVFRDeparture(callsign: string){
        const flightPlan = flightPlans.find(flight => flight.callsign === callsign);
        if(!flightPlan){
            return;
        }
        reviewVFRAircraftType(flightPlan)
        reviewVFRRoute(flightPlan);
        reviewVFRAltitude(flightPlan);
        reviewVFRRemarks(flightPlan);
    }

    function reviewVFRAircraftType(flightPlan: FlightPlan){
        if(flightPlan.aircraftType !== flightPlan.actualAircraftType){
            addMistake("badVFRAircraft", flightPlan.aircraftType, `${flightPlan.callsign}(${flightPlan.actualAircraftType})`)
        }
    }

    function reviewVFRRoute(flightPlan: FlightPlan){
        if(flightPlan.route.length === 0){
            addMistake("badVFRRoute", flightPlan.callsign);
        }
    }

    function reviewVFRAltitude(flightPlan: FlightPlan){
        const regex = /VFR\/\d{3}/;
        if(!regex.test(flightPlan.altitude) || flightPlan.altitude.length !== 7 || flightPlan.altitude.charAt(flightPlan.altitude.length - 1) !== "5"){
            return addMistake("VFRAltFormat", flightPlan.altitude);
        }

        if(!flightPlan.requestedAltitude){
            return;
        }

        let requestedAltitude = `${Number(flightPlan.requestedAltitude) / 100}`;
        if(requestedAltitude.length === 2){
            requestedAltitude = `0${requestedAltitude}`;
        }
        requestedAltitude = `VFR/${requestedAltitude}`;
        if(requestedAltitude !== flightPlan.altitude){
            return addMistake("badVFRAlt", flightPlan.altitude, `${flightPlan.callsign}(requested ${flightPlan.requestedAltitude})`);
        }
    }

    function reviewVFRRemarks(flightPlan: FlightPlan){
        if((flightPlan.routeType === "VFRFF" && !flightPlan.remarks.toUpperCase().includes("FF")) || (flightPlan.routeType === "VFR" && flightPlan.remarks.includes("FF"))){
            addMistake("badVFRFF", flightPlan.remarks, flightPlan.callsign);
        }
    }

    const value: MistakeDetails = {
        mistakes,
        addMistake,
        reviewClearance,
        newMistake,
        setNewMistake,
        reviewVFRDeparture
    }

    return <MistakeContext.Provider value={value}>{children}</MistakeContext.Provider>
}
