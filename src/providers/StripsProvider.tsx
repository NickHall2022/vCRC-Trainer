import { useState, type ReactNode } from "react";
import type { AbstractStrip, BayName, DividerData, FlightPlan, StripData, StripsDetails } from "../types/common";
import { useFlightPlans } from "../hooks/useFlightPlans";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from 'uuid';
import { StripsContext } from "../hooks/useStrips";
import useSound from "use-sound";

export function StripsProvider({ children }: { children: ReactNode }){

    const { flightPlans } = useFlightPlans();
    const [selectedBay, setSelectedBay] = useState<BayName>("ground");
    const [playPrintSound] = useSound("/vSweatbox/printer.mp3");
    
    const [strips, setStrips] = useImmer<AbstractStrip[]>((): AbstractStrip[] => {
        const flightStrips: StripData[] = flightPlans.filter(flightPlan => flightPlan.created).map(flightPlan => {
            return {...flightPlan, bayName: "printer" as BayName, id: uuidv4(), offset: false, type: "strip", box10: "", box12: ""};
        });
        const dividers: DividerData[] = [
            {
                id: uuidv4(),
                bayName: "ground",
                offset: false,
                name: "taxi",
                type: "divider"
            },
            {
                id: uuidv4(),
                bayName: "ground",
                offset: false,
                name: "pushback",
                type: "divider"
            },
            {
                id: uuidv4(),
                bayName: "ground",
                offset: false,
                name: "clearance",
                type: "divider"
            },
            {
                id: uuidv4(),
                bayName: "local",
                offset: false,
                name: "runway",
                type: "divider"
            },
            {
                id: uuidv4(),
                bayName: "local",
                offset: false,
                name: "holdCross",
                type: "divider"
            }
        ]
        return [...flightStrips, ...dividers];
    });

    function printAmendedFlightPlan(flightPlan: FlightPlan) {
        printStrip({
            ...flightPlan,
            bayName: "printer",
            id: uuidv4(),
            offset: false,
            type: "strip",
            box10: "",
            box12: ""
        });
    }

    function printStrip(strip: StripData){
        playPrintSound();
        setStrips((draft) => {
            for (let i = draft.length - 1; i >= 0; i--) {
                if (draft[i].bayName === "printer" && strip.callsign === (draft[i] as StripData).callsign) {
                    draft.splice(i, 1);
                }
            }
            draft.splice(0, 0, strip);
        });
    }

    function deleteStrip(idToDelete: string){
        setStrips((draft) => {
            const deleteIndex = strips.findIndex(strip => strip.id === idToDelete);
            draft.splice(deleteIndex, 1);
        });
    }

    function moveStripToBay(stripToAdd: AbstractStrip, bayName: BayName){
        setStrips((draft) => {
            const modifiedIndex = draft.findIndex(strip => strip.id === stripToAdd.id);
            const [removedStrip] = draft.splice(modifiedIndex, 1);
            removedStrip.bayName = bayName;
            removedStrip.offset = false;
            draft.push(removedStrip);
        });
    }

    const value: StripsDetails = {
        strips,
        setStrips,
        printerStrips: strips.filter(strip => strip.bayName === "printer") as StripData[],
        printAmendedFlightPlan,
        printStrip,
        deleteStrip,
        selectedBay,
        setSelectedBay,
        moveStripToBay
    }

    return <StripsContext.Provider value={value}>{children}</StripsContext.Provider>
}
