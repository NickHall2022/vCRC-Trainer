import { useFlightPlans } from "../../hooks/useFlightPlans";
import type { FlightPlan } from "../../types/common";

export function Airplane({flightPlan}: {flightPlan: FlightPlan}){
    const {setSelectedFlightPlan} = useFlightPlans();

    const handleClick = function (event: React.MouseEvent){
        if(!event.ctrlKey){
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }
    
    return (
        <div>
            <div style={{zoom: "100%", top: `${flightPlan.positionY + 3}%`, left: `${flightPlan.positionX - 2}%`}} className="dataBlock">
                <p style={{margin: "0px"}}>{flightPlan.callsign}</p>
                <p style={{margin: "0px"}}>{flightPlan.aircraftType}</p>
            </div>
            
            <img src="/plane-icon.png" draggable={false} onClick={handleClick} style={{width: "18px", position: "absolute", top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, rotate: `-${flightPlan.rotation}deg`}}></img>
        </div>
    )
}
