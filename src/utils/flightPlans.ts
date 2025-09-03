import type { AircraftRequest, FlightPlan, PrefRoute, PrefRouteDetails, ParkingSpot, Aircraft, AircraftDefaultAttributes, FlightPlanDefaultIFRAttributes } from "../types/common";

type UnspawnedVFRAircraft = Omit<Aircraft, keyof AircraftDefaultAttributes>

export const VALID_WEST_ALT = ["040", "060", "080", "100", "120", "140", "160", "180", "200", "220", "240", "260", 
    "280",  "300",  "320", "340", "360", "380", "400", "430"];
export const VALID_EAST_ALT = ["030", "050", "070", "090", "110", "130", "150", "170", "190", "210", "230", "250", 
    "270", "290",  "310",  "330", "350", "370", "390", "410"];

export const HIGH_WEST_ALT = ["200", "220", "240", "260", "280", "300", "320", "340", "360", "380", "400", "430"];
export const HIGH_EAST_ALT = ["210", "230", "250", "270", "290", "310", "330", "350", "370", "390", "410"];
const SPAWNABLE_HIGH_WEST_ALT = ["220", "240", "260", "280", "300", "320", "340", "360", "380"];
const SPAWNABLE_HIGH_EAST_ALT = ["230", "250", "270", "290", "310", "330", "350", "370"];

export const TEC_WEST_ALT = ["040", "060", "080", "100"];
export const TEC_EAST_ALT = ["030", "050", "070", "090"];
const SPAWNABLE_TEC_WEST_ALT = ["060", "080", "100"];
const SPAWNABLE_TEC_EAST_ALT = ["050", "070", "090"];

export const jetTypes = ["CRJ7", "CRJ9", "CRJX", "B737", "B738", "B739", "B38M", "A220", "A319", "A320", "A321", "A20N", "A21N", "E135", "E145", "E190"];
export const tecTypes = ["C208", "BE58", "B350", "C414", "P212", "BN2P", "C408", "DHC6", "TBM9"];

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
export const ATIS = alphabet[Math.floor(Math.random() * alphabet.length)];

export const DEST_TO_DIRECTION_MAP: Record<string, "west" | "east" | undefined> = {
    //H
    "KBWI": "west",
    "KCLE": "west",
    "KCLT": "west",
    "KCVG": "west",
    "KDCA": "west",
    "KDTW": "west",
    "KEWR": "west",
    "KHPN": "west",
    "KIAD": "west",
    "KJFK": "west",
    "KLGA": "west",
    "KMCO": "west",
    "KMIA": "west",
    "KMSP": "west",
    "KORD": "west",
    "KPBI": "west",
    "KPHL": "west",
    "KPIT": "west",
    "KRDU": "west",
    "KRSW": "west",
    "KSRQ": "west",
    "KTPA": "west",
    //TEC
    "KACK": "west",
    "KALB": "west",
    "KBDL": "west",
    "KBDR": "west",
    "KBED": "west",
    "KBOS": "west",
    "KDXR": "west",
    "KFRG": "west",
    "KGON": "west",
    "KHFD": "west",
    "KHVN": "west",
    "KHYA": "west",
    "KISP": "west",
    "KMVY": "west",
    "KORH": "west",
    "KOWD": "west",
    "KOXC": "west",
    "KPNE": "west",
    "KPVC": "west",
    "KPVD": "west",
    "KSWF": "west"
};

let unspawnedVFRAircraft: UnspawnedVFRAircraft[] = [];

export function makeEmptyFlightPlan(): FlightPlan {
    return {
        callsign: "",
        CID: "",
        aircraftType: "",
        equipmentCode: "",
        departure: "",
        destination: "",
        speed: "",
        altitude: "",
        route: "",
        remarks: "",
        printCount: 1,
        plannedTime: "",
        created: false,
        routeType: "VFR",
        squawk: ""
    }
}

export function makeNewFlight(parkingSpot: ParkingSpot, prefRoutes: PrefRouteDetails): Aircraft {
    if(parkingSpot.type === "airline"){
        return makeNewAirlineFlight(parkingSpot, prefRoutes);
    } else if(parkingSpot.type === "TEC"){
        return makeNewTecFlight(parkingSpot, prefRoutes)
    }
    return makeNewVFRFlight(parkingSpot)
}

export function makeNewAirlineFlight(parkingSpot: ParkingSpot, prefRoutes: PrefRouteDetails): Aircraft {
    const type = getRandomJetType();
    const prefRoute = getRandomRoute(prefRoutes.highRoutes);
    const callsign = `${parkingSpot.airline}${buildRandomFlightNumber()}`;

    return buildIFRWithPushBackRequests(
        {
            callsign,
            actualAircraftType: type,
            size: 1.2,
            ...buildDefaultAircraftAttributes(parkingSpot),
            flightPlan: {
                callsign,
                aircraftType: type,
                equipmentCode: getRandomJetEquipment(),
                speed: getRandomJetSpeed(),
                routeType: "H",
                ...buildDefaultIFRFlightPlanAttributes(prefRoute)
            }
        }, parkingSpot.pushbackIntoRamp, parkingSpot.location
    )
}

function makeNewTecFlight(parkingSpot: ParkingSpot, prefRoutes: PrefRouteDetails): Aircraft {
    const type = getRandomTecType();
    const prefRoute = getRandomRoute(prefRoutes.tecRoutes);

    const callsign = parkingSpot.airline ? `${parkingSpot.airline}${buildRandomFlightNumber()}` : buildRandomNNumber();
    
    return buildIFRWithoutPushBackRequests(
        {
            callsign,
            actualAircraftType: type,
            size: 0.8,
            ...buildDefaultAircraftAttributes(parkingSpot),
            flightPlan: {
                callsign,
                aircraftType: type,
                equipmentCode: getRandomTecEquipment(),
                speed: getRandomTecSpeed(),
                routeType: "TEC",
                ...buildDefaultIFRFlightPlanAttributes(prefRoute)
            }
        }, parkingSpot.location, parkingSpot.taxiInstruction
    )
}

function buildDefaultIFRFlightPlanAttributes(prefRoute: PrefRoute): FlightPlanDefaultIFRAttributes {
    const CID = generateRandomString(1000, 3);
    const plannedTime = `P12${generateRandomString(60, 2)}`
    return {
        departure: "KPWM",
        plannedTime, 
        remarks: "",
        CID, 
        printCount: 1,
        created: true,
        altitude: getRandomIFRAltitude(prefRoute),
        destination: `K${prefRoute.destination}`,
        route: prefRoute.route,
        squawk: buildRandomSquawk()
    };
}

function buildDefaultAircraftAttributes(parkingSpot: ParkingSpot) : AircraftDefaultAttributes {
    return {
        parkingSpotId: parkingSpot.id,
        positionX: parkingSpot.x,
        positionY: parkingSpot.y,
        rotation: parkingSpot.rotation,
        status: "ramp",
        canSendRequestTime: 0
    }
}

function buildIFRWithPushBackRequests(aircraft: Omit<Aircraft, "requests">, intoRamp: boolean, location: string): Aircraft {
    return {
        ...aircraft,
        requests: [
            buildClearanceRequest(aircraft, true),
            buildPusbackRequest(intoRamp, aircraft.callsign, location),
            buildTaxiRequest(aircraft.callsign)
        ]
    };
}

function buildIFRWithoutPushBackRequests(aircraft: Omit<Aircraft, "requests">, location: string, taxiInstruction?: string): Aircraft {
    return {
        ...aircraft,
        requests: [
            buildClearanceRequest(aircraft, false),
            buildTaxiRequest(aircraft.callsign, location, taxiInstruction)
        ]
    };
}

function buildClearanceRequest(aircraft: Omit<Aircraft, "requests">, withPushback: boolean): AircraftRequest {
    const flightPlan = aircraft.flightPlan;
    return {
        requestMessage: `Request IFR clearance to ${flightPlan.destination}`,
        responseMessage: `Cleared to ${flightPlan.destination}, squawk ${aircraft.flightPlan.squawk}`,
        priority: 1,
        callsign: aircraft.callsign,
        nextRequestDelay: 0,
        atcMessage: `Clearance sent to ${aircraft.callsign}`,
        subsequentRequest: {
            responseMessage: withPushback ? "Will call for pushback" : "Will call for taxi",
            reminder: {
                message: "Ground, did you copy our readback?",
                type: "readbackIFR",
                sendDelay: 20000,
            },
            priority: 1,
            atcMessage: `Readback correct for ${aircraft.callsign}`,
            callsign: aircraft.callsign,
            nextRequestDelay: 90000 + Math.floor(Math.random() * 60000)
        },
        nextStatus: "clearedIFR"
    }
}

function buildPusbackRequest(intoRamp: boolean, callsign: string, gate: string): AircraftRequest {
    return {
        requestMessage: `Request pushback with ${ATIS} from gate ${gate}`,
        responseMessage: intoRamp ? "Pushback into the ramp at our discretion, will call for taxi" : "Pushback approved, will call for taxi",
        atcMessage: `Push approved for ${callsign}`,
        priority: 1,
        callsign: callsign,
        nextRequestDelay: 90000 + Math.floor(Math.random() * 60000),
        nextStatus: "pushback"
    }
}

function buildTaxiRequest(callsign: string, location?: string, taxiInstruction?: string): AircraftRequest {
    return {
        requestMessage: `Ready for taxi${location ? ` with ${ATIS} from ${location}` : ""}`,
        atcMessage: `Taxi instruction sent to ${callsign}`,
        responseMessage: taxiInstruction ? taxiInstruction : "Runway 29, taxi via A, cross runway 36",
        priority: 2,
        callsign: callsign,
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

function makeNewVFRFlight(parkingSpot: ParkingSpot): Aircraft {
    if(unspawnedVFRAircraft.length === 0){
        generateVFRFlightsToSpawn();
    }
    const index = Math.floor(Math.random() * unspawnedVFRAircraft.length);
    const newAircraft = unspawnedVFRAircraft.splice(index, 1)[0];
    return {
        ...newAircraft,
        ...buildDefaultAircraftAttributes(parkingSpot),
    }
}

function generateVFRFlightsToSpawn(){
    unspawnedVFRAircraft = [
        buildVFRPatternRequest(createUnspawnedVFRAircraft()),
        buildFlightFollowingVFRDepartureRequest(createUnspawnedVFRAircraft()),
        buildFlightFollowingVFRDepartureRequest(createUnspawnedVFRAircraft()),
        buildNoFlightFollowingVFRDepartureRequest(createUnspawnedVFRAircraft()),
        buildNoFlightFollowingVFRDepartureRequest(createUnspawnedVFRAircraft())
    ]
}

function createUnspawnedVFRAircraft() : Omit<UnspawnedVFRAircraft, "requests"> {
    const callsign = buildRandomNNumber();
    return {
        actualAircraftType: getRandomGAType(),
        callsign,
        size: 0.8,
        flightPlan: createVFRFlightPlan(callsign)
    }
}

function createVFRFlightPlan(callsign: string) : FlightPlan {
    return {
        callsign,
        aircraftType: "",
        equipmentCode: "",
        departure: "",
        destination: "",
        speed: "",
        altitude: "",
        route: "",
        remarks: "",
        created: false,
        routeType: "VFR",
        printCount: 0,
        squawk: buildRandomSquawk(),
        CID: generateRandomString(1000, 3),
        plannedTime: `P12${generateRandomString(60, 2)}`
    };
}

function buildNoFlightFollowingVFRDepartureRequest(aircraft: Omit<UnspawnedVFRAircraft, "requests">): UnspawnedVFRAircraft {
    return buildVFRDepartureRequest(aircraft, false);
}

function buildFlightFollowingVFRDepartureRequest(aircraft: Omit<UnspawnedVFRAircraft, "requests">): UnspawnedVFRAircraft {
    return buildVFRDepartureRequest(aircraft, true);
}

function buildVFRDepartureRequest(aircraft: Omit<UnspawnedVFRAircraft, "requests">, flightFollowing: boolean): UnspawnedVFRAircraft {
    const direction = getRandomDepartureDirection();
    const altitude = getRandomVFRAltitude(direction);
    return {
        ...aircraft,
        requests: [
            {
                requestMessage: `Type ${aircraft.actualAircraftType} at the north apron with ${ATIS}, request VFR departure${flightFollowing ? " with flight following" : ""} to the ${direction} at ${altitude}`,
                responseMessage: `Maintain VFR at or below 2500, departure 119.75, squawk ${aircraft.flightPlan.squawk}`,
                priority: 1,
                callsign: aircraft.callsign,
                nextRequestDelay: 0,
                atcMessage: `VFR clearance sent to ${aircraft.callsign}`,
                subsequentRequest: {
                    responseMessage: "Runway 29, taxi via C, A, cross runway 36",
                    atcMessage: `Taxi instruction sent to ${aircraft.callsign}`,
                    reminder: {
                        message: "Ready to taxi",
                        type: "taxiVFR",
                        sendDelay: 20000,
                    },
                    priority: 1,
                    nextStatus: "taxi",
                    callsign: aircraft.callsign,
                    nextRequestDelay: 0
                }
            }
        ],
        flightPlan: {
            ...aircraft.flightPlan,
            routeType: flightFollowing ? "VFRFF" : "VFR",
            requestedAltitude: altitude
        }
    }
}

function buildVFRPatternRequest(aircraft: Omit<UnspawnedVFRAircraft, "requests">): UnspawnedVFRAircraft {
    return {
        ...aircraft,
        requests: [
            {
                requestMessage: `Type ${aircraft.actualAircraftType} at the north apron with ${ATIS}, request taxi for pattern work`,
                responseMessage: `Squawk VFR, runway 29, taxi via C, A, cross runway 36`,
                nextStatus: "taxi",
                atcMessage: `Taxi instruction sent to ${aircraft.callsign}`,
                priority: 1,
                callsign: aircraft.callsign,
                nextRequestDelay: 0
            }
        ],
        flightPlan: {
            ...aircraft.flightPlan,
            routeType: "pattern"
        }
    }
}

function buildRandomSquawk(){
    const squawk = `${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}`;
    if(squawk === "7500" || squawk === "7600" || squawk === "7700"){
        return buildRandomSquawk();
    }
    return squawk;
}

function buildRandomFlightNumber(){
    if(Math.random() < 0.5){
        return `${Math.ceil(Math.random() * 8)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
    }
     return `${Math.ceil(Math.random() * 8)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
}

function getRandomJetType() {
    return jetTypes[Math.floor(Math.random() * jetTypes.length)];
}

function getRandomTecType() {
    return tecTypes[Math.floor(Math.random() * tecTypes.length)];
}

function getRandomGAType() {
    const gaTypes = ["C152", "C172", "C182", "P28A", "BE36", "BE58"];
    return gaTypes[Math.floor(Math.random() * gaTypes.length)];
}

function getRandomRoute(prefRoutes: PrefRoute[]) {
    const prefRoute = prefRoutes[Math.floor(Math.random() * prefRoutes.length)];
    let routeString = prefRoute.route.substring(4, prefRoute.route.length - 4);
    
    if(Math.random() > 0.75){
        const random = Math.random();
        if(random < 0.33){
            const blankRoutes = ["IFR DIRECT", "DIRECT", ""]
            routeString = blankRoutes[Math.floor(Math.random() * blankRoutes.length)];
        } else if(random >= 0.33 && random < 0.44) {
            const otherRoutes = prefRoutes.filter(route => route.destination !== prefRoute.destination);
            const randomRoute = otherRoutes[Math.floor(Math.random() * otherRoutes.length)];
            routeString = randomRoute.route.substring(4, randomRoute.route.length - 4);
        } else {
            const splitRoute = routeString.split(" ")
            const numElementsToDrop = Math.floor(Math.random() * Math.ceil(splitRoute.length / 2));
            if(Math.random() < 0.5){
                splitRoute.splice(splitRoute.length - numElementsToDrop - 1);
            } else {
                splitRoute.splice(0, numElementsToDrop);
            }
            routeString = splitRoute.join(" ");
        }
    }

    return {
        ...prefRoute,
        route: routeString
    }
}

function getRandomIFRAltitude(prefRoute: PrefRoute) {
    if(prefRoute.type === "TEC"){
        if(Math.random() < 0.75){
            const index = Math.floor(Math.random() * SPAWNABLE_TEC_WEST_ALT.length);
            return SPAWNABLE_TEC_WEST_ALT[index];
        }
        const random = Math.random();
        if(random < 0.33){
            const index = Math.floor(Math.random() * SPAWNABLE_TEC_EAST_ALT.length);
            return SPAWNABLE_TEC_EAST_ALT[index];
        }
        if(random >= 0.33 && random < 0.66){
            const index = Math.floor(Math.random() * SPAWNABLE_HIGH_WEST_ALT.length);
            return SPAWNABLE_HIGH_WEST_ALT[index];
        }
        if(Math.random() < 0.5){
            const index = Math.floor(Math.random() * SPAWNABLE_TEC_WEST_ALT.length);
            const alt = `${SPAWNABLE_TEC_WEST_ALT[index]}00`;
            if(alt.charAt(0) === "0"){
                return alt.substring(1);
            }
            return alt;
        }
        const index = Math.floor(Math.random() * SPAWNABLE_TEC_WEST_ALT.length);
        return `VFR/${SPAWNABLE_TEC_WEST_ALT[index]}`;
    }

    if(Math.random() < 0.75){
        const index = Math.floor(Math.random() * SPAWNABLE_HIGH_WEST_ALT.length);
        return SPAWNABLE_HIGH_WEST_ALT[index];
    }
    const random = Math.random();
    if(random < 0.33){
        const index = Math.floor(Math.random() * SPAWNABLE_HIGH_EAST_ALT.length);
        return SPAWNABLE_HIGH_EAST_ALT[index];
    }
    if(random >= 0.33 && random < 0.66){
        const index = Math.floor(Math.random() * SPAWNABLE_HIGH_WEST_ALT.length);
        return `FL${SPAWNABLE_HIGH_WEST_ALT[index]}`;
    }
    if(Math.random() < 0.5){
        const index = Math.floor(Math.random() * SPAWNABLE_HIGH_WEST_ALT.length);
        return `${SPAWNABLE_HIGH_WEST_ALT[index]}00`;
    }
    const index = Math.floor(Math.random() * SPAWNABLE_HIGH_WEST_ALT.length);
    return `VFR/${SPAWNABLE_HIGH_WEST_ALT[index]}`;
}

function getRandomVFRAltitude(direction: string) {
    let start = 3;
    if(direction.includes("west")){
        start = 4;
    }
    
    const selectedValue = start + (Math.floor(Math.random() * 4) * 2);
    return `${selectedValue}500`;
}

function buildRandomNNumber(){
    const numLetters = Math.random() < 0.5 ? 1 : 2;
    const numNumbers = 5 - numLetters;
    const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let callsign = "";
    for(let i = 0; i < numNumbers; i++){
        if(i === 0){
            callsign += Math.ceil(Math.random() * 8);
        } else {
            callsign += Math.floor(Math.random() * 9);
        }
    }
    for(let i = 0; i < numLetters; i++){
        callsign += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    }

    return `N${callsign}`;
}

function getRandomJetSpeed() {
    const minValue = 390;
    const maxValue = 540;
    const selectedValue = minValue + Math.floor(Math.random() * (maxValue - minValue));
    return `${selectedValue}`;
}

function getRandomTecSpeed() {
    const minValue = 150;
    const maxValue = 200;
    const selectedValue = minValue + Math.floor(Math.random() * (maxValue - minValue));
    return `${selectedValue}`;
}

function getRandomJetEquipment() {
    if(Math.random() < 0.75){
        return "L";
    }
    const equipmentCodes = ["X", "G", "W", "P", "A", "D", "B", "T", "U"];
    return equipmentCodes[Math.floor(Math.random() * equipmentCodes.length)];
}

function getRandomTecEquipment() {
    if(Math.random() < 0.75){
        return "G";
    }
    const equipmentCodes = ["X", "L", "W", "P", "A", "D", "B", "T", "U"];
    return equipmentCodes[Math.floor(Math.random() * equipmentCodes.length)];
}

function getRandomDepartureDirection(){
    const directions = ["northeast", "north", "northwest", "west", "southwest"];
    return directions[Math.floor(Math.random() * directions.length)];
}
