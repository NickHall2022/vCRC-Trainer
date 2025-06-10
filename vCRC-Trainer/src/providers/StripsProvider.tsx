import { type ReactNode } from "react";
import type { BayName, FlightPlan, StripData, StripsDetails } from "../types/common";
import { useFlightPlans } from "../hooks/useFlightPlans";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from 'uuid';
import { StripsContext } from "../hooks/useStrips";
import { makeEmptyFlightPlan } from "../assets/flightPlans";

export function StripsProvider({ children }: { children: ReactNode }){

    const { flightPlans } = useFlightPlans();
    
    const [strips, setStrips] = useImmer<StripData[]>((): StripData[] => {
        const flightStrips = flightPlans.map(flightPlan => {
            return {...flightPlan, bayName: "printer" as BayName, id: uuidv4()};
        });
        const dividers: StripData[] = [
            {
                ...makeEmptyFlightPlan(),
                callsign: "taxi",
                id: uuidv4(),
                bayName: "ground"
            },
            {
                ...makeEmptyFlightPlan(),
                callsign: "pushback",
                id: uuidv4(),
                bayName: "ground"
            },
            {
                ...makeEmptyFlightPlan(),
                callsign: "clearance",
                id: uuidv4(),
                bayName: "ground"
            },
            {
                ...makeEmptyFlightPlan(),
                callsign: "runway",
                id: uuidv4(),
                bayName: "local"
            },
            {
                ...makeEmptyFlightPlan(),
                callsign: "holdCross",
                id: uuidv4(),
                bayName: "local"
            }
        ]
        return [...flightStrips, ...dividers];
    });

    function printAmendedFlightPlan(flightPlan: FlightPlan) {
        setStrips((draft) => {
            draft.splice(0, 0, {
                ...flightPlan,
                bayName: "printer",
                id: uuidv4()
            })
        })
    }

    const value: StripsDetails = {
        strips,
        setStrips,
        printerStrips: strips.filter(strip => strip.bayName === "printer"),
        printAmendedFlightPlan
    }

    return <StripsContext.Provider value={value}>{children}</StripsContext.Provider>
}
