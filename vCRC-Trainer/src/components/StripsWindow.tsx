import { useState } from "react"
import type { FlightPlan } from "../types/flightPlan"
import { Strip } from "./Strip"
import { useFlightPlans } from "../hooks/useFlightPlans"

export function StripsWindow(){
    const { flightPlans } = useFlightPlans();
    const [strips, setStrips] = useState<FlightPlan[]>(flightPlans)
    const [draggedSrip, setDraggedStrip] = useState<FlightPlan>({} as FlightPlan);

    function executeSwap(droppedIndex: number, draggedIndex: number){
        setStrips((prev) => {
            const newStrips = [...prev]
            newStrips[draggedIndex] = newStrips[droppedIndex];
            newStrips[droppedIndex] = draggedSrip;
            return newStrips;
        });
    }

    function swapStrips(targetStrip: FlightPlan){
        const draggedIndex = strips.findIndex(strip => strip.callsign === draggedSrip.callsign);
        const droppedIndex = strips.findIndex(strip => strip.callsign === targetStrip.callsign);
        executeSwap(droppedIndex, draggedIndex)
    }

    function createStrips(){
        return strips.map((strip, index) => {
            return <Strip flightPlan={strip} key={strip.callsign} index={index} setDraggedStrip={setDraggedStrip} swapStrips={swapStrips}></Strip>
        })
    }

    function handleDrop(){
        const draggedIndex = strips.findIndex(strip => strip.callsign === draggedSrip.callsign);
        executeSwap(strips.length - 1, draggedIndex);
    }
    
    function handleDragOver(event: React.DragEvent){
        event.preventDefault();
    }

    return (
        <div className="preventSelect container" style={{position:"relative", height: "100vh"}}>
            <img src="/stripBay.png" draggable={false} style={{width: "100%", height: "100%"}} onDrop={handleDrop} onDragOver={handleDragOver}></img>
            {createStrips()}
        </div>
    )
}