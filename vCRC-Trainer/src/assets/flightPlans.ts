import type { FlightPlan } from "../types/common";

export const FLIGHT_PLANS: FlightPlan[] = [
    {
        callsign: "DAL1234",
        CID: "921",
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
        rotation: 42,
        printCount: 1
    },
    {
        callsign: "JBU9234",
        CID: "053",
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
        rotation: 68,
        printCount: 1
    },
    {
        callsign: "JBU1321",
        CID: "674",
        squawk: "4352",
        aircraftType: "B378",
        equipmentCode: "L",
        departure: "KPWM",
        destination: "KPHX",
        speed: "315",
        altitude: "340",
        route: "HYLND7 HYLND CAM Q822 GONZZ Q29 KLYNE ROD VHP J110 BUM ICT LBL FTI BUKKO ZUN EAGUL6",
        remarks: "",
        positionX: 58,
        positionY: 45.5,
        rotation: 68,
        printCount: 1
    },
    {
        callsign: "N3545J",
        CID: "512",
        squawk: "4352",
        aircraftType: "C172",
        equipmentCode: "G",
        departure: "KPWM",
        destination: "KBOS",
        speed: "120",
        altitude: "VFR/065",
        route: "",
        remarks: "",
        positionX: 63,
        positionY: 30,
        rotation: 0,
        printCount: 1
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
        rotation: 0,
        printCount: 1
    }
}