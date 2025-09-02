
import { useFlightPlans } from "../../hooks/useFlightPlans";
import { useSimulation } from "../../hooks/useSimulation";
import type { FlightPlan } from "../../types/common";
import { useRef } from "react";

export function Airplane({flightPlan}: {flightPlan: FlightPlan}){
    const {setSelectedFlightPlan} = useFlightPlans();
    const planeRef = useRef<HTMLImageElement>(null);

    const { completeRequest } = useSimulation();

    function handleClick (event: React.MouseEvent){
        if(!event.ctrlKey){
            completeRequest(flightPlan.callsign);
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }

    return (
        <>
            <div>
                <img ref={planeRef} src="planeIcon.png" draggable={false} id={flightPlan.callsign} onClick={handleClick} style={{
                        width: `${flightPlan.size}%`, 
                        position: "absolute", 
                        top: `${flightPlan.positionY}%`, 
                        left: `${flightPlan.positionX}%`, 
                        transform:` translate(-50%, -50%) rotate(${-flightPlan.rotation}deg)`, 
                        cursor: "pointer"
                    }}
                ></img>
            </div>
            {/* <div style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, position: "absolute", backgroundColor: "black", width: "3px", height: "3px"}}></div> */}
        </>
    )
}
