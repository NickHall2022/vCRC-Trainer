import { useRef, useState, type RefObject } from "react";
import { useFlightPlans } from "../../hooks/useFlightPlans";
import { Airplane } from "./Airplane";
import { ControllerList } from "./ControllerList";
import { FlightPlanEditor } from "./FlightPlanEditor";
import Draggable from "react-draggable";

export function CabViewWindow(){
    const {flightPlans} = useFlightPlans();
    const [zoom, setZoom] = useState<number>(1);
    const [rotate, setRotate] = useState<number>(0);
    const draggableRef = useRef<HTMLDivElement>(null);

    function createAirplanes() {
        return flightPlans.map(flightPlan => {
            return <Airplane flightPlan={flightPlan} key={flightPlan.callsign} zoom={zoom} rotate={rotate}></Airplane>
        })
    }

    function handleScroll(event: React.WheelEvent){
        if(event.shiftKey){
            let newRotate = event.deltaY > 0 ? rotate - 2 : rotate + 2;
            setRotate(newRotate);
        } else {
            let newZoom = event.deltaY > 0 ? zoom - 0.1 : zoom + 0.1;
            if(newZoom < 1){
                newZoom = 1;
            }
            if(newZoom > 4){
                newZoom = 4;
            }
            setZoom(newZoom);
        }
    }
    
    return (
        <div>
            <div style={{overflow: "hidden"}}>
                <Draggable nodeRef={draggableRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".handle">
                    <div ref={draggableRef} onWheel={handleScroll} className={"handle"}>
                        <div id="cabViewContainer" className="preventSelect" style={{
                                transform: `scale(${zoom}) rotate(${rotate}deg)`
                            }}
                        >
                            <img src="/PWM.png" draggable={false} style={{objectFit: "cover", width: `100%`}}></img>
                            {createAirplanes()}
                        </div>
                    </div>
                </Draggable>
            </div>
            <FlightPlanEditor></FlightPlanEditor>
            <ControllerList></ControllerList>
        </div>
    )
}
