import { createContext, useContext } from "react";
import type { ParkingSpotMethods } from "../types/common";

export const ParkingSpotContext = createContext<ParkingSpotMethods>({} as ParkingSpotMethods)

export function useParkingSpots(){
    const context = useContext(ParkingSpotContext);
    if(!context){
        throw new Error("useParkingSpots must be used within ParkingSpotContext");
    }

    return context;
}
