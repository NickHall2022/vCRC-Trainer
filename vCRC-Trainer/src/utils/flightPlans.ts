import type { AircraftRequest, FlightPlan, PrefRoute, PrefRouteDetails } from "../types/common";

type PartialFlightPlan = Omit<FlightPlan, "requests" | "canSendRequestTime" | "printCount" | "CID" | "plannedTime" | "pushbackLocation" | "status">;
type PartialFlightPlanWithRequests = PartialFlightPlan & { requests: AircraftRequest[], canSendRequestTime: number };

const terminalJetParkingSpots = [
    {x: 58.5, y: 46.5, rotation: 70, pushbackIntoRamp: false, airline: "UAL"},
    // {x: 57.5, y: 45.5, rotation: 70, pushbackIntoRamp: false},
    {x: 57, y: 45, rotation: 70, pushbackIntoRamp: false, airline: "SWA"},
    {x: 55.5, y: 44.5, rotation: 70, pushbackIntoRamp: false, airline: "MXY"},
    {x: 54, y: 44, rotation: 70, pushbackIntoRamp: false, airline: "FFT"},
    {x: 52.5, y: 43.5, rotation: 70, pushbackIntoRamp: false, airline: "DAL"},
    {x: 51, y: 43, rotation: 70, pushbackIntoRamp: false, airline: "DAL"},

    {x: 50, y: 42, rotation: 30, pushbackIntoRamp: true, airline: "AAL"},
    // {x: 49.125, y: 40.25, rotation: 30, pushbackIntoRamp: true},
    {x: 48.25, y: 38.5, rotation: 30, pushbackIntoRamp: true, airline: "AAL"},
    {x: 47.365, y: 36.75, rotation: 30, pushbackIntoRamp: true, airline: "AAL"},
    {x: 46.5, y: 35, rotation: 30, pushbackIntoRamp: true, airline: "AAL"}
]

export function createStartingFlightPlans(prefRoutes: PrefRouteDetails): FlightPlan[] {
    const terminalJets = terminalJetParkingSpots.map(parkingSpot => {
        const type = getRandomJetType();
        const prefRoute = getRandomRoute(prefRoutes.highRoutes);
        return buildIFRWithPushBackRequests({
            callsign: `${parkingSpot.airline}${buildRandomFlightNumber()}`,
            squawk: buildRandomSquawk(),
            aircraftType: type,
            actualAircraftType: type,
            equipmentCode: getRandomJetEquipment(),
            departure: "KPWM",
            destination: `K${prefRoute.destination}`,
            speed: getRandomJetSpeed(),
            altitude: getRandomJetAltitude(),
            route: prefRoute.route.substring(4, prefRoute.route.length - 4),
            remarks: "",
            size: 1.2,
            positionX: parkingSpot.x,
            positionY: parkingSpot.y,
            rotation: parkingSpot.rotation,
            created: true
        }, parkingSpot.pushbackIntoRamp)
    });

    const gaPlanes = [
        buildVFRWithFFRequests({
            callsign: "N3545J",
            squawk: buildRandomSquawk(),
            aircraftType: "",
            actualAircraftType: "C172",
            equipmentCode: "",
            departure: "",
            destination: "",
            speed: "",
            altitude: "",
            route: "",
            remarks: "",
            size: 0.85,
            positionX: 63,
            positionY: 30,
            rotation: 0,
            created: false
        }),
    ]

    return buildDefaultAttributes([
        ...terminalJets,
        ...gaPlanes
    ]);
}

export function makeEmptyFlightPlan(): FlightPlan {
    return {
        callsign: "",
        CID: "",
        squawk: "",
        aircraftType: "",
        actualAircraftType: "",
        equipmentCode: "",
        departure: "",
        destination: "",
        speed: "",
        altitude: "",
        route: "",
        remarks: "",
        size: 0,
        positionX: 0,
        positionY: 0,
        rotation: 0,
        printCount: 1,
        requests: [],
        canSendRequestTime: 0,
        plannedTime: "",
        pushbackLocation: {
            x: 0,
            y: 0
        },
        status: "ramp",
        created: false
    }
}

function buildIFRWithPushBackRequests(flightPlan: PartialFlightPlan, intoRamp: boolean): PartialFlightPlanWithRequests {
    return {
        ...flightPlan,
        requests: [
            buildClearanceRequest(flightPlan),
            buildPusbackRequest(intoRamp, flightPlan),
            buildTaxiRequest(flightPlan)
        ],
        canSendRequestTime: 0
    };
}

function buildClearanceRequest(flightPlan: PartialFlightPlan): AircraftRequest {
    return {
        requestMessage: `Request IFR clearance to ${flightPlan.destination}`,
        responseMessage: `Cleared to ${flightPlan.destination}, squawk ${flightPlan.squawk}`,
        priority: 1,
        callsign: flightPlan.callsign,
        nextRequestDelay: 0,
        subsequentRequest: {
            responseMessage: "Will call for pushback",
            reminder: {
                message: "Ground, did you copy our readback?",
                sendDelay: 20000,
            },
            priority: 1,
            callsign: flightPlan.callsign,
            nextRequestDelay: 210000 + Math.floor(Math.random() * 60000)
        }
    }
}

function buildPusbackRequest(intoRamp: boolean, flightPlan: PartialFlightPlan): AircraftRequest {
    return {
        requestMessage: "Request pushback with A",
        responseMessage: intoRamp ? "Pushback into the ramp at our discretion, will call for taxi" : "Pushback approved, will call for taxi",
        priority: 2,
        callsign: flightPlan.callsign,
        nextRequestDelay: 150000 + Math.floor(Math.random() * 60000),
        nextStatus: "pushback"
    }
}

function buildTaxiRequest(flightPlan: PartialFlightPlan): AircraftRequest {
    return {
        requestMessage: "Ready for taxi",
        responseMessage: "Runway 29, taxi via A, cross runway 36",
        priority: 3,
        callsign: flightPlan.callsign,
        nextRequestDelay: 0,
        nextStatus: "taxi"
    }
}

function generateRandomString(maxValue: number, numDigits: number){
    let randomString = Math.floor(Math.random() * maxValue).toString();
    const startLength = randomString.length;
    for(let i = 0; i < numDigits - startLength; i++){
        randomString = "0" + randomString;
    }
    return randomString;
}

function buildDefaultAttributes(flightPlansWithRequests: PartialFlightPlanWithRequests[]): FlightPlan[] {
    return flightPlansWithRequests.map(flightPlan => {
        const CID = generateRandomString(1000, 3);
        const plannedTime = `P12${generateRandomString(60, 2)}`
        const angleAsRadians = flightPlan.rotation * Math.PI / 180;
        const pushbackLocation = { x: flightPlan.positionX - 4 * Math.cos(angleAsRadians), y: flightPlan.positionY + 4 * Math.sin(angleAsRadians)};
        return { ...flightPlan, plannedTime, CID, printCount: 1, pushbackLocation, status: "ramp" }
    })
}

function buildVFRWithFFRequests(flightPlan: PartialFlightPlan): PartialFlightPlanWithRequests{
    return {
        ...flightPlan,
        requests: [
            {...buildVFRFFDepartureRequest(flightPlan), callsign: flightPlan.callsign}
        ],
        canSendRequestTime: 0
    };
}

function buildVFRFFDepartureRequest(flightPlan: PartialFlightPlan): AircraftRequest {
    return {
        requestMessage: `Type ${flightPlan.actualAircraftType} at the north apron with A, request southbound VFR departure with flight following`,
        responseMessage: `Maintain VFR at or below 2500, departure 119.75, squawk ${flightPlan.squawk}`,
        priority: 1,
        callsign: flightPlan.callsign,
        nextRequestDelay: 0,
        subsequentRequest: {
            responseMessage: "Runway 29, taxi via C, A, cross runway 36",
            reminder: {
                message: "Ready to taxi",
                sendDelay: 20000,
            },
            priority: 1,
            nextStatus: "taxi",
            callsign: flightPlan.callsign,
            nextRequestDelay: 0
        }
    }
}

function buildRandomSquawk(){
    return `${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}`;
}

function buildRandomFlightNumber(){
    return `${Math.ceil(Math.random() * 8)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 99)}`;
}

function getRandomJetType() {
    const jetTypes = ["CRJ7", "CRJ9", "CRJX", "B737", "B738", "B739", "B38M", "A220", "A319", "A320", "A321", "A20N", "A21N", "E135", "E145", "E190"];
    return jetTypes[Math.floor(Math.random() * jetTypes.length)];
}

function getRandomRoute(prefRoutes: PrefRoute[]) {
    return prefRoutes[Math.floor(Math.random() * prefRoutes.length)];
}

function getRandomJetAltitude() {
    const minValue = 25;
    const maxValue = 35;
    const selectedValue = minValue + Math.floor(Math.random() * (maxValue - minValue));
    return `${selectedValue}0`;
}

function getRandomJetSpeed() {
    const minValue = 390;
    const maxValue = 540;
    const selectedValue = minValue + Math.floor(Math.random() * (maxValue - minValue));
    return `${selectedValue}`;
}

function getRandomJetEquipment() {
    if(Math.random() < 0.65){
        return "L";
    }
    const equipmentCodes = ["X", "G", "W", "P", "A", "D", "B"];
    return equipmentCodes[Math.floor(Math.random() * equipmentCodes.length)];
}
