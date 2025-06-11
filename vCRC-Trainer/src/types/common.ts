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

export type BayName = "ground" | "local" | "printer"

export type StripData = FlightPlan & {
    bayName: BayName;
    id: string;
    box10?: string;
    box12?: string;
}

export type FlightPlanDetails = {
    flightPlans: FlightPlan[];
    getFlightByCallsign: (callsign: string) => FlightPlan | undefined;
    selectedFlightPlan: FlightPlan | undefined;
    setSelectedFlightPlan: (callsign: string) => void;
    amendFlightPlan: (amendedFlightPlan: FlightPlan) => void
}

export type StripsDetails = {
    strips: StripData[];
    setStrips: Updater<StripData[]>;
    printerStrips: StripData[];
    printAmendedFlightPlan: (flightPlan: FlightPlan) => void;
    printStrip: (strip: StripData) => void;
}
