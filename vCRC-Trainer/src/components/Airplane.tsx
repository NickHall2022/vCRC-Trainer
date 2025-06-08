import { useFlightPlans } from "../hooks/useFlightPlans";
import type { FlightPlan } from "../types/flightPlan";

export function Airplane({flightPlan, zoom, transformOrigin}: {flightPlan: FlightPlan, zoom: number, transformOrigin:{x: number, y: number}}){
    const {setSelectedFlightPlan} = useFlightPlans();

    const handleClick = function (event: React.MouseEvent){
        if(!event.ctrlKey){
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }

    function convertXByZoomFactor(value: number, factor: number, transformOrigin: {x: number, y: number}){
        const xDiff = value - transformOrigin.x;
        const zoomFactor = (factor - 100) / 100;
        return value + (xDiff * zoomFactor);
    }

    function convertYByZoomFactor(value: number, factor: number, transformOrigin: {x: number, y: number}){
        const yDiff = value - transformOrigin.y;
        const zoomFactor = (factor - 100) / 100;
        return value + (yDiff * zoomFactor);
    }
    
    return (
        <div onClick={handleClick}>
            
            <div style={{zoom: "100%", top: `${convertYByZoomFactor(flightPlan.positionY, zoom, transformOrigin) + 3}%`, left: `${convertXByZoomFactor(flightPlan.positionX, zoom, transformOrigin) - 2}%`}} className="dataBlock">
                <p style={{margin: "0px"}}>{flightPlan.callsign}</p>
                <p style={{margin: "0px"}}>{flightPlan.aircraftType}</p>
            </div>
            
            <img src="/plane-icon.png" draggable={false} style={{transform: `scale(${zoom/100})`, width: "18px", position: "absolute", top: `${convertYByZoomFactor(flightPlan.positionY, zoom, transformOrigin)}%`, left: `${convertXByZoomFactor(flightPlan.positionX, zoom, transformOrigin)}%`, rotate: `-${flightPlan.rotation}deg`}}></img>
        </div>
    )
}
// }${}%transformOrigin: `${transformOrigin.x}% ${transformOrigin.y}%`