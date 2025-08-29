import type { Dispatch, SetStateAction } from "react";
import type { Updater } from "use-immer";

export type FlightStatus = "ramp" | "clearedIFR" | "pushback" | "taxi" | "departing" | "departed";

export type FlightPlan = {
    callsign: string;
    CID: string;
    squawk: string;
    aircraftType: string;
    actualAircraftType: string;
    equipmentCode: string;
    departure: string;
    destination: string;
    plannedTime: string;
    speed: string;
    size: number;
    altitude: string;
    route: string;
    remarks: string;
    positionX: number;
    positionY: number;
    rotation: number;
    printCount: number;
    routeType?: "TEC" | "H" | "VFR"
    requests: AircraftRequest[];
    canSendRequestTime: number;
    pushbackLocation: { x: number, y: number};
    status: FlightStatus;
    created: boolean;
    parkingSpotId: string;
}

export type PartialFlightPlan = Omit<FlightPlan, "requests" | "canSendRequestTime" | "printCount" | "CID" | "plannedTime" | "pushbackLocation" | "status" | "parkingSpotId">;
export type PartialFlightPlanWithRequests = PartialFlightPlan & { requests: AircraftRequest[], canSendRequestTime: number };

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
    removeFirstRequest: (callsign: string) => void;
    setNextRequestTime: (callsign: string, canSendRequestTime: number) => void;
    setPlanePosition: (callsign: string, x: number, y: number, angle?: number) => void;
    setPlaneStatus: (callsign: string, status: FlightStatus) => void;
    deleteFlightPlan: (callsign: string) => void;
    spawnNewFlight: () => FlightPlan | undefined;
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

export type MessageType = "system" | "ATC" | "radio";

export type Message = {
    callsign: string;
    time: number;
    content: string;
    type: MessageType;
}

export type MessagesDetails = {
    messages: Message[];
    sendMessage: (content: string, callsign: string, type: MessageType) => void;
}

export type AircraftRequest = {
    callsign: string;
    priority: number;
    responseMessage?: string;
    requestMessage?: string;
    subsequentRequest?: AircraftRequest;
    nextRequestDelay: number;
    nextStatus?: FlightStatus;
    reminder?: {
        message: string;
        sendDelay: number;
        sendTime?: number;
    }
}

export type SimulationDetails = {
    completeRequest: (callsign: string) => void;
    setPaused: Dispatch<SetStateAction<boolean>>
}

export type FaaRouteType = "L" | "H" | "LSD" | "HSD" | "SLD" | "HLD" | "TEC";

export type PrefRoute = {
    area?: string;
    a_artcc: string;
    altitude?: string;
    origin: string;
    aircraft?: string;
    destination: string;
    hours1?: string;
    hours2?: string;
    hours3?: string;
    type: FaaRouteType;
    d_artcc: string;
    route: string;
    flow?: string;
    seq: number;
}

export type PrefRouteDetails = {
    tecRoutes: PrefRoute[];
    highRoutes: PrefRoute[];
}

export type ParkingSpot = {
    x: number;
    y: number;
    rotation: number;
    location: string;
    pushbackIntoRamp?: boolean;
    airline?: string;
    available: boolean;
    id: string;
    type: ParkingSpotType;
}

export type ParkingSpotType = "airline" | "ga";

export type ParkingSpotMethods = {
    reserveSpot: (type: ParkingSpotType) => ParkingSpot | undefined;
    releaseSpot: (id: string) => void;
}

export type DifficultyDetails = {
    difficulty: number,
    setDifficulty: Dispatch<SetStateAction<number>>
}

export type MistakeType = "stripBox" | "badRoute" | "IFRAltFormat" | "VFRAltFormat" | "badIFRAlt" | "badVFRAlt" | "badEquipment" | 
    "stripHandoff" | "aircraftHandoff" | "readbackIFR" | "taxiVFR";

export type Mistake = {
    type: MistakeType;
    details?: string;
    secondaryDetails?: string;
}

export type MistakeDetails = {
    mistakes: Mistake[];
    addMistake: (type: MistakeType) => void;
    reviewClearance: (callsign: string) => void;
}
