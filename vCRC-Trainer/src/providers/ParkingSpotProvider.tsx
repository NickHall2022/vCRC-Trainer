import { type ReactNode } from "react";
import type { ParkingSpot, ParkingSpotMethods, ParkingSpotType } from "../types/common";
import { useImmer } from "use-immer";
import { v4 as uuidv4 } from 'uuid';
import { ParkingSpotContext } from "../hooks/useParkingSpots";

const AIRLINE_SPOTS: Omit<ParkingSpot, "available" | "id" | "type">[] = [
    {x: 58.5, y: 46.5, rotation: 70, pushbackIntoRamp: false, airline: "UAL", location: "2"},
    {x: 57, y: 45, rotation: 70, pushbackIntoRamp: false, airline: "SWA", location: "4"},
    {x: 55.5, y: 44.5, rotation: 70, pushbackIntoRamp: false, airline: "MXY", location: "5"},
    {x: 54, y: 44, rotation: 70, pushbackIntoRamp: false, airline: "FFT", location: "6"},
    {x: 52.5, y: 43.5, rotation: 70, pushbackIntoRamp: false, airline: "DAL", location: "7"},
    {x: 51, y: 43, rotation: 70, pushbackIntoRamp: false, airline: "DAL", location: "8"},

    {x: 50, y: 42, rotation: 30, pushbackIntoRamp: true, airline: "AAL", location: "9"},
    {x: 49.125, y: 40.25, rotation: 30, pushbackIntoRamp: true, airline: "AAL", location: "10"},
    {x: 48.25, y: 38.5, rotation: 30, pushbackIntoRamp: true, airline: "AAL", location: "11"},
    {x: 47.365, y: 36.75, rotation: 30, pushbackIntoRamp: true, airline: "AAL", location: "12"},
    {x: 46.5, y: 35, rotation: 30, pushbackIntoRamp: true, airline: "AAL", location: "14"}
]

const GA_SPOTS: Omit<ParkingSpot, "available" | "id" | "type">[] = [
    {x: 62.5, y: 34, rotation: 0, location: "north ramp"},
    {x: 62.8, y: 32, rotation: 0, location: "north ramp"},
    {x: 63.1, y: 30, rotation: 0, location: "north ramp"},
    {x: 63.4, y: 28, rotation: 0, location: "north ramp"},
    {x: 63.7, y: 26, rotation: 0, location: "north ramp"},
]

export function ParkingSpotProvider({ children }: { children: ReactNode }){
    const [parkingSpots, setParkingSpots] = useImmer<ParkingSpot[]>([
            ...AIRLINE_SPOTS.map(spot => {
                return {...spot, available: true, id: uuidv4(), type: "airline" as ParkingSpotType}
            }),
            ...GA_SPOTS.map(spot => {
                return {...spot, available: true, id: uuidv4(), type: "ga" as ParkingSpotType}
            })
        ]
    );

    function reserveSpot(type: ParkingSpotType): ParkingSpot | undefined {
        const openSpots = parkingSpots.filter(spot => spot.available && spot.type === type);
        if(openSpots.length === 0){
            return;
        }
        const randomSpot = openSpots[Math.floor(Math.random() * openSpots.length)];
        setParkingSpots(draft => {
            const replaceIndex = draft.findIndex(spot => spot.id === randomSpot.id);
            if(replaceIndex !== -1){
                draft[replaceIndex].available = false;
            }
        });
        return randomSpot;
    }

    function releaseSpot(id: string) {
        setParkingSpots(draft => {
            const replaceIndex = draft.findIndex(spot => spot.id === id);
            if(replaceIndex !== -1){
                draft[replaceIndex].available = true;
            }
        })
    }

    const value: ParkingSpotMethods = {
        reserveSpot,
        releaseSpot
    }

    return <ParkingSpotContext.Provider value={value}>{children}</ParkingSpotContext.Provider>
}
