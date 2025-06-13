import type { AircraftRequest, FlightPlan } from "../types/common";

type PartialFlightPlan = Omit<FlightPlan, "requests" | "canSendRequestTime" | "printCount" | "CID" | "plannedTime" | "pushbackLocation" | "status">;
type PartialFlightPlanWithRequests = PartialFlightPlan & { requests: AircraftRequest[], canSendRequestTime: number };

export const FLIGHT_PLANS: FlightPlan[] = buildDefaultAttributes([
    buildIFRWithPushBackRequests({
        callsign: "DAL1234",
        squawk: buildRandomSquawk(),
        aircraftType: "A320",
        actualAircraftType: "A320",
        equipmentCode: "L",
        departure: "KPWM",
        destination: "KORD",
        speed: "320",
        altitude: "280",
        route: "HSKEL3 CAM Q822 FNT WYNDE2",
        remarks: "",
        size: 1.3,
        positionX: 49,
        positionY: 40,
        rotation: 42,
        created: true
    }, true),
    buildIFRWithPushBackRequests({
        callsign: "JBU9234",
        squawk: buildRandomSquawk(),
        aircraftType: "CRJ7",
        actualAircraftType: "CRJ7",
        equipmentCode: "A",
        departure: "KPWM",
        destination: "KBOS",
        speed: "290",
        altitude: "150",
        route: "ENE OOSHN5",
        remarks: "",
        size: 1.3,
        positionX: 55,
        positionY: 44,
        rotation: 68,
        created: true
    }, false),
    buildIFRWithPushBackRequests({
        callsign: "JBU1321",
        squawk: buildRandomSquawk(),
        aircraftType: "B378",
        actualAircraftType: "B378",
        equipmentCode: "L",
        departure: "KPWM",
        destination: "KPHX",
        speed: "315",
        altitude: "340",
        route: "HYLND7 HYLND CAM Q822 GONZZ Q29 KLYNE ROD VHP J110 BUM ICT LBL FTI BUKKO ZUN EAGUL6",
        remarks: "TCAS",
        size: 1.3,
        positionX: 58,
        positionY: 45.5,
        rotation: 68,
        created: true
    }, false),
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
]);

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
            {...buildClearanceRequest(flightPlan), callsign: flightPlan.callsign},
            {...buildPusbackRequest(intoRamp, flightPlan)}
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
            nextRequestDelay: 1//180000
        }
    }
}

function buildPusbackRequest(intoRamp: boolean, flightPlan: PartialFlightPlan): AircraftRequest {
    return {
        requestMessage: "Request pushback with A",
        responseMessage: intoRamp ? "Pushback into the ramp at our discretion, will call for taxi" : "Pushback approved, will call for taxi",
        priority: 2,
        callsign: flightPlan.callsign,
        nextRequestDelay: 1,//150000,
        nextStatus: "pushback"
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

function buildVFRFFDepartureRequest(flightPlan: PartialFlightPlan){
    return {
        requestMessage: `Request southbound VFR departure with flight following, information A`,
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
            callsign: flightPlan.callsign,
            nextRequestDelay: 1//180000
        }
    }
}

function buildRandomSquawk(){
    return `${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}`;
}
