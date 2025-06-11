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
        printStrip({
            ...flightPlan,
            bayName: "printer",
            id: uuidv4()
        });
    }

    function printStrip(strip: StripData){
        setStrips((draft) => {
            for (let i = draft.length - 1; i >= 0; i--) {
                if (draft[i].bayName === "printer" && strip.callsign === draft[i].callsign) {
                    draft.splice(i, 1);
                }
            }
            draft.splice(0, 0, strip);
        });
    }

    const value: StripsDetails = {
        strips,
        setStrips,
        printerStrips: strips.filter(strip => strip.bayName === "printer"),
        printAmendedFlightPlan,
        printStrip
    }

    return <StripsContext.Provider value={value}>{children}</StripsContext.Provider>
}
