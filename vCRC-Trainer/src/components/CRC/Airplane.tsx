
import { useFlightPlans } from "../../hooks/useFlightPlans";
import { useSimulation } from "../../hooks/useSimulation";
import type { FlightPlan } from "../../types/common";

export function Airplane({flightPlan, zoom, rotate}: {flightPlan: FlightPlan, zoom: number, rotate: number}){
    const {setSelectedFlightPlan} = useFlightPlans();

    const { completeRequest } = useSimulation();

    const handleClick = function (event: React.MouseEvent){
        if(!event.ctrlKey){
            completeRequest(flightPlan.callsign);
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }

    return (
        <>
            <div>
                <div style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, transform: `scale(${1 / zoom}) translate(-${50 * zoom}%, ${75}%) rotate(${-rotate}deg)`, zIndex: 3}} className="dataBlock">
                    <p style={{margin: "0px"}}>{flightPlan.callsign}</p>
                    <p style={{margin: "0px"}}>{flightPlan.actualAircraftType}</p>
                </div>

                <img src="/planeIcon.png" draggable={false} onClick={handleClick} style={{
                        width: `${flightPlan.size}%`, 
                        position: "absolute",
                        top: `${flightPlan.positionY}%`, 
                        left: `${flightPlan.positionX}%`, 
                        transform:`rotate(-${flightPlan.rotation}deg) translate(${-50}%, ${-50})%`, 
                    }}
                >
                </img>
            </div>
            {/* <div style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, position: "absolute", backgroundColor: "black", width: "3px", height: "3px"}}></div> */}
        </>
    )
}
