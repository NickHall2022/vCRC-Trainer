import type React from "react";
import { useFlightPlans } from "../hooks/useFlightPlans";
import { Airplane } from "./Airplane";
import { FlightPlanEditor } from "./FlightPlanEditor";
import { useState } from "react";

export function CabViewWindow(){
    const {flightPlans} = useFlightPlans();
    const [zoom, setZoom] = useState<number>(100);
    const [transformOrigin, setTransformOrigin] = useState({
        x: 0,
        y: 0
    });

    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({x: 0, y: 0});
    const [draggedPos, setDraggedPos] = useState({x: 0, y: 0});

    function createAirplanes() {
        return flightPlans.map(flightPlan => {
            return <Airplane flightPlan={flightPlan} key={flightPlan.callsign} zoom={zoom} transformOrigin={transformOrigin}></Airplane>
        })
    }
    
    function handleScroll(event: React.WheelEvent) {
        let target = event.target as HTMLElement;
        
        while(target?.id !== "cabViewContainer"){
            target = target?.parentElement as HTMLElement;
        }

        const rect = target.getBoundingClientRect();
        console.log(rect.height)

        
        if(event.deltaY < 0 && zoom < 300){
            setZoom(zoom + 10);
            // setDraggedPos((prev) => {
            //     return ({
            //         x: prev.x - rect.width * 0.05,
            //         y: prev.y - rect.height * 0.05,
            //     });
            // });
        } else if(event.deltaY > 0 && zoom > 100) {
            setZoom(zoom - 10);
            // setDraggedPos((prev) => {
            //     return ({
            //         x: prev.x + rect.width * 0.05,
            //         y: prev.y + rect.height * 0.05,
            //     });
            // });
        }

        event.preventDefault();
    }

    function handleMouseDown(event: React.MouseEvent){
        if(event.button === 2){
            setDragging(true)
            setDragStart({x: event.clientX - draggedPos.x, y: event.clientY - draggedPos.y});
            event.preventDefault();
        }
    }

    function handleMouseMove(event: React.MouseEvent){
        if(dragging){
            setDraggedPos({x: event.clientX - dragStart.x, y: event.clientY - dragStart.y})
            console.log(event.clientX - dragStart.x, event.clientY - dragStart.y)
        }
    }

    function handleMouseUp(event: React.MouseEvent){
        if(event.button === 2){
            setDragging(false);
        }
    }

    console.log(zoom)
    
    return (
        <>
            <div id="cabViewContainer" className="preventSelect container" style={{position:"relative", overflow:"hidden", display: "inline-block", width: "fitContent"}} onWheel={handleScroll}>
                <img src="/PWM.png" id={`${draggedPos}`} draggable={false} style={{objectFit: "cover", width: `100%`,  position: "relative", left: `${draggedPos.x}px`, top: `${draggedPos.y}px`, transformOrigin: `50% 50%`, transform:`scale(${zoom}%)`}} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}></img>
                {createAirplanes()}
            </div>
            <FlightPlanEditor></FlightPlanEditor>
        </>
    )
}
