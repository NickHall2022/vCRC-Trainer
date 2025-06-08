
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
}

export type FlightPlanDetails = {
    flightPlans: FlightPlan[];
    getFlightByCallsign: (callsign: string) => FlightPlan | undefined;
    selectedFlightPlan: FlightPlan | undefined;
    setSelectedFlightPlan: (callsign: string) => void;
    amendFlightPlan: (amendedFlightPlan: FlightPlan) => void
}
