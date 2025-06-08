import type { FlightPlan } from "../types/flightPlan";

export const FLIGHT_PLANS: FlightPlan[] = [
    {
        callsign: "DAL1234",
        CID: "123456",
        squawk: "1236",
        aircraftType: "A320",
        equipmentCode: "L",
        departure: "KPWM",
        destination: "KORD",
        speed: "320",
        altitude: "280",
        route: "HSKEL3 CAM Q822 FNT WYNDE2",
        remarks: "",
        positionX: 49,
        positionY: 40,
        rotation: 42
    },
    {
        callsign: "JBU9234",
        CID: "678678",
        squawk: "4352",
        aircraftType: "CRJ7",
        equipmentCode: "A",
        departure: "KPWM",
        destination: "KBOS",
        speed: "290",
        altitude: "150",
        route: "ENE OOSHN5",
        remarks: "",
        positionX: 55,
        positionY: 44,
        rotation: 65
    },
]

export function makeEmptyFlightPlan(): FlightPlan {
    return {
        callsign: "",
        CID: "",
        squawk: "",
        aircraftType: "",
        equipmentCode: "",
        departure: "",
        destination: "",
        speed: "",
        altitude: "",
        route: "",
        remarks: "",
        positionX: 0,
        positionY: 0,
        rotation: 0
    }
}