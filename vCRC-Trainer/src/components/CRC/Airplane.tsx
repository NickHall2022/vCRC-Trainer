import { useFlightPlans } from "../../hooks/useFlightPlans";
import type { FlightPlan } from "../../types/common";

export function Airplane({flightPlan, zoom, rotate}: {flightPlan: FlightPlan, zoom: number, rotate: number}){
    const {setSelectedFlightPlan} = useFlightPlans();

    const handleClick = function (event: React.MouseEvent){
        if(!event.ctrlKey){
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }
    
    return (
        <div>
            <div style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, transform: `scale(${1 / zoom}) translate(-${40 * zoom}%, ${90}%) rotate(${-rotate}deg)`, zIndex: 3}} className="dataBlock">
                <p style={{margin: "0px"}}>{flightPlan.callsign}</p>
                <p style={{margin: "0px"}}>{flightPlan.aircraftType}</p>
            </div>
            
            <img src="/planeIcon.png" draggable={false} onClick={handleClick} style={{width: "1.3%", position: "absolute", top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, rotate: `-${flightPlan.rotation}deg`}}></img>
        </div>
    )
}
