import type { Dispatch, SetStateAction } from "react";
import type { Updater } from "use-immer";

export type FlightPlan = {
    callsign: string;
    CID: string;
    squawk: string;
    aircraftType: string;
    equipmentCode: string;
    departure: string;
    destination: string;
    speed: string;
    altitude: string;
    route: string;
    remarks: string;
    positionX: number;
    positionY: number;
    rotation: number;
    printCount: number;
}

export type BayName = "ground" | "local" | "spare" | "printer"

export type AbstractStrip = {
    id: string;
    bayName: BayName;
    offset: boolean;
    type: "divider" | "strip" | "handwrittenDivider" | "blank";
}

export type StripData = AbstractStrip & FlightPlan & {
    box10?: string;
    box12?: string;
}

export type DividerData = AbstractStrip & {
    name: string;
}

export type FlightPlanDetails = {
    flightPlans: FlightPlan[];
    getFlightByCallsign: (callsign: string) => FlightPlan | undefined;
    selectedFlightPlan: FlightPlan | undefined;
    setSelectedFlightPlan: (callsign: string) => void;
    amendFlightPlan: (amendedFlightPlan: FlightPlan) => void
}

export type StripsDetails = {
    strips: AbstractStrip[];
    setStrips: Updater<AbstractStrip[]>;
    printerStrips: StripData[];
    printAmendedFlightPlan: (flightPlan: FlightPlan) => void;
    printStrip: (strip: StripData) => void;
    deleteStrip: (idToDelete: string) => void;
    selectedBay: BayName;
    setSelectedBay: Dispatch<SetStateAction<BayName>>;
    moveStripToBay: (stripToMove: AbstractStrip, bayName: BayName) => void;
}
