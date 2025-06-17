import { useRef } from "react";
import { useFlightPlans } from "../../hooks/useFlightPlans";
import { useSimulation } from "../../hooks/useSimulation";
import type { FlightPlan } from "../../types/common";

export function Airplane({flightPlan, zoom, rotate}: {flightPlan: FlightPlan, zoom: number, rotate: number}){
    const {setSelectedFlightPlan} = useFlightPlans();

    const { completeRequest } = useSimulation();
    const planeImageRef = useRef(null);
    const dataBlockRef = useRef<HTMLDivElement>(null);

    const handleClick = function (event: React.MouseEvent){
        if(!event.ctrlKey){
            completeRequest(flightPlan.callsign);
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }

    function getDatablockCenterPos(){
        if(dataBlockRef.current){
            const rect = dataBlockRef.current.getBoundingClientRect();
            console.log(dataBlockRef.current.getClientRects())
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            }
        }
    }
    
    const dataBlockCenterPos = getDatablockCenterPos();
    console.log(dataBlockCenterPos)

    return (
        <>
            <div>
                <div ref={dataBlockRef} style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, transform: `scale(${1 / zoom}) translate(-${80 * zoom}%, ${50}%) rotate(${-rotate}deg)`, zIndex: 3}} className="dataBlock">
                    <p style={{margin: "0px"}}>{flightPlan.callsign}</p>
                    <p style={{margin: "0px"}}>{flightPlan.actualAircraftType}</p>
                </div>

                <img src="/planeIcon.png" ref={planeImageRef} draggable={false} onClick={handleClick} style={{
                        width: `${flightPlan.size}%`, 
                        position: "absolute", 
                        top: `${flightPlan.positionY}%`, 
                        left: `${flightPlan.positionX}%`, 
                        transform:` translate(-50%, -50%) rotate(${-flightPlan.rotation}deg)`, 
                    }}
                ></img>
                {dataBlockCenterPos && <svg style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none"}}>
                    <line
                        x1={`${flightPlan.positionX}%`}
                        y1={`${flightPlan.positionY}%`}
                        x2={`${flightPlan.positionX - 1}%`}
                        y2={`${flightPlan.positionY + 2}%`}
                        stroke={"rgb(1, 172, 1)"}
                        strokeWidth={"1.5"}
                    />
                </svg>}
            </div>
            {/* <div style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, position: "absolute", backgroundColor: "black", width: "3px", height: "3px"}}></div> */}
        </>
    )
}
