import { useFlightPlans } from "../../hooks/useFlightPlans";
import { useSimulation } from "../../hooks/useSimulation";
import type { FlightPlan } from "../../types/common";

export function Airplane({flightPlan, zoom, rotate}: {flightPlan: FlightPlan, zoom: number, rotate: number}){
    const {setSelectedFlightPlan} = useFlightPlans();

    const { completeRequest } = useSimulation();

    function handleClick (event: React.MouseEvent){
        if(!event.ctrlKey){
            completeRequest(flightPlan.callsign);
            return;
        }
        
        setSelectedFlightPlan(flightPlan.callsign);
    }

    function handleDataBlockClick (event: React.MouseEvent){
        if(!event.ctrlKey){
            completeRequest(flightPlan.callsign);
            return;
        }

        const target = event.currentTarget as HTMLDivElement;
        target.style.pointerEvents = 'none';

        // Create a new event at the same position to "re-fire" the click
        const underlyingElement = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;

        if (underlyingElement) {
            underlyingElement.click();
        }

        // Restore pointer events so this element continues to work normally
        setTimeout(() => {
            target.style.pointerEvents = 'auto';
        }, 0);
    }

    return (
        <>
            <div>
                {/* <div style={{}}> */}
                    {/* <Draggable nodeRef={dataBlockRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".inner"> */}
                        <div onClick={handleDataBlockClick} style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, transform: `scale(${1 / zoom}) translate(-${120 * zoom}%, ${-40}%) rotate(${-rotate}deg)`, zIndex: 3}} className="dataBlock">
                            <p style={{margin: "0px"}}>{flightPlan.callsign}</p>
                            <p style={{margin: "0px"}}>{flightPlan.actualAircraftType}</p>
                        </div>
                    {/* </Draggable> */}
                {/* </div> */}

                <img src="/planeIcon.png" draggable={false} onClick={handleClick} style={{
                        width: `${flightPlan.size}%`, 
                        position: "absolute", 
                        top: `${flightPlan.positionY}%`, 
                        left: `${flightPlan.positionX}%`, 
                        transform:` translate(-50%, -50%) rotate(${-flightPlan.rotation}deg)`, 
                    }}
                ></img>
                <svg style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none"}}>
                    <line
                        x1={`${flightPlan.positionX}%`}
                        y1={`${flightPlan.positionY}%`}
                        x2={`${flightPlan.positionX - 2.5}%`}
                        y2={`${flightPlan.positionY + 1}%`}
                        stroke={"rgb(1, 172, 1)"}
                        strokeWidth={`${2 / zoom}`}
                    />
                </svg>
            </div>
            {/* <div style={{top: `${flightPlan.positionY}%`, left: `${flightPlan.positionX}%`, position: "absolute", backgroundColor: "black", width: "3px", height: "3px"}}></div> */}
        </>
    )
}
