import type { Dispatch, SetStateAction } from "react";
import type { FlightPlan } from "../types/flightPlan";

type Props = {flightPlan: FlightPlan, index: number, setDraggedStrip: Dispatch<SetStateAction<FlightPlan>>, swapStrips: (targetStrip: FlightPlan) => void}

export function Strip({flightPlan, index, setDraggedStrip, swapStrips}: Props){

    function handleDragStart(){
        setDraggedStrip(flightPlan);
    }

    function handleDrop(){
        swapStrips(flightPlan)
    }
    
    function handleDragOver(event: React.DragEvent){
        event.preventDefault();
    }

    return (
        <div style={{
            position: "absolute", 
            left: "0px", 
            bottom: `${80 * index}px`,
            backgroundColor: "white",
            color: "black",
            width: "100%",
            height: "80px"
        }} draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver}>
            {flightPlan.callsign}
        </div>
    )
}