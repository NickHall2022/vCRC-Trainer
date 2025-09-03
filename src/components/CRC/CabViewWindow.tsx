import { useEffect, useRef, useState, type RefObject } from "react";
import { useAircraft } from "../../hooks/useAircraft";
import { Airplane } from "./Airplane";
import { ControllerList } from "./ControllerList";
import { FlightPlanEditor } from "./FlightPlanEditor";
import Draggable from "react-draggable";
import { MessageWindow } from "./MessageWindow";
import { Taxiways } from "../debug/Taxiways";
import { DataBlock } from "./DataBlock";

export function CabViewWindow(){
    const { aircrafts } = useAircraft();
    const [zoom, setZoom] = useState<number>(1);
    const [rotate, setRotate] = useState<number>(0);
    const draggableRef = useRef<HTMLDivElement>(null);
    const visualizeTaxiways = false;

    useEffect(() => {
        const draggable = draggableRef.current;
        if (!draggable) {
            return;
        }

        const preventLeftClickDrag = (event: MouseEvent) => {
            if(event.buttons === 1){
                event.stopPropagation();
                event.preventDefault();
            }
        };

        draggable.addEventListener("mousedown", preventLeftClickDrag);

        return () => {
            draggable.removeEventListener("mousedown", preventLeftClickDrag);
        };
    }, []);

    function createAirplanes() {
        return aircrafts.map(aircraft => {
            return <Airplane aircraft={aircraft} key={aircraft.callsign}></Airplane>
        })
    }

    function createDataBlocks() {
        return aircrafts.map(aircraft => {
            return <DataBlock aircraft={aircraft} key={aircraft.callsign}></DataBlock>
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
                <Draggable nodeRef={draggableRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".handle" cancel=".inner">
                    <div ref={draggableRef} onWheel={handleScroll} className={"handle"}>
                        <div id="cabViewContainer" className="preventSelect" style={{
                                transform: `scale(${zoom}) rotate(${rotate}deg)`
                            }}
                        >
                            <img src="PWM.png" draggable={false} style={{objectFit: "cover", width: `100%`}}></img>
                            {createAirplanes()}
                            { visualizeTaxiways && <Taxiways></Taxiways> }
                        </div>
                    </div>
                </Draggable>
                {createDataBlocks()}
            </div>
            <FlightPlanEditor></FlightPlanEditor>
            <ControllerList></ControllerList>
            <MessageWindow></MessageWindow>
        </div>
    )
}
