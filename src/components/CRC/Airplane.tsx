
import { useAircraft } from "../../hooks/useAircraft";
import { useSimulation } from "../../hooks/useSimulation";
import type { Aircraft } from "../../types/common";
import { useRef } from "react";

export function Airplane({aircraft}: {aircraft: Aircraft}){
    const { setSelectedFlightPlan } = useAircraft();
    const planeRef = useRef<HTMLImageElement>(null);

    const { completeRequest } = useSimulation();

    function handleClick (event: React.MouseEvent){
        if(!event.ctrlKey){
            completeRequest(aircraft.callsign);
            return;
        }
        
        setSelectedFlightPlan(aircraft.callsign);
    }

    return (
        <>
            <div>
                <img ref={planeRef} src="planeIcon.png" draggable={false} id={aircraft.callsign} onClick={handleClick} style={{
                        width: `${aircraft.size}%`, 
                        position: "absolute", 
                        top: `${aircraft.positionY}%`, 
                        left: `${aircraft.positionX}%`, 
                        transform:` translate(-50%, -50%) rotate(${-aircraft.rotation}deg)`, 
                        cursor: "pointer"
                    }}
                ></img>
            </div>
        </>
    )
}
