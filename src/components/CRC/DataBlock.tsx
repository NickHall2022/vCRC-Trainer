import { useEffect, useRef, type RefObject } from "react";
import type { Aircraft } from "../../types/common";
import Draggable from "react-draggable";

export function DataBlock({aircraft}: {aircraft: Aircraft}){
    const dataBlockRef = useRef<HTMLSpanElement>(null);
    const lineRef = useRef<SVGLineElement>(null);
    const animationRef = useRef<number>(null);

    useEffect(() => {
        const updatePosition = () => {
            const planeRect = document.getElementById(aircraft.callsign)?.getBoundingClientRect();
            const dataBlockElement = dataBlockRef.current;
            const dataBlockRect = dataBlockRef.current?.getBoundingClientRect();
            const lineElement = lineRef.current;

            if (planeRect && dataBlockElement && dataBlockRect && lineElement) {
                const planeCenterX = planeRect.left + planeRect.width / 2;
                const planeCenterY = planeRect.top + planeRect.height / 2;

                const dataBlockX = planeCenterX + 40;
                const dataBlockY = planeCenterY - 30;

                dataBlockElement.style.left = `${dataBlockX}px`;
                dataBlockElement.style.top = `${dataBlockY}px`;
                dataBlockElement.style.display = "inline";

                const dataBlockCenterX = dataBlockRect.left;

                lineElement.setAttribute("x1", planeCenterX.toString());
                lineElement.setAttribute("y1", planeCenterY.toString());
                lineElement.setAttribute("x2", dataBlockCenterX.toString());
                lineElement.setAttribute("y2", dataBlockRect.top.toString());

                if(dataBlockCenterX !== 0){
                    lineElement.style.display = "inline";
                }
            }

            animationRef.current = requestAnimationFrame(updatePosition);
        };

        animationRef.current = requestAnimationFrame(updatePosition);

        return () => {
            if(animationRef.current){
                cancelAnimationFrame(animationRef.current);
            }
        }
    }, [aircraft.callsign]);

    function handleDataBlockWheel (event: React.WheelEvent){
        const target = event.currentTarget as HTMLElement;
        target.style.pointerEvents = 'none';

        const underlyingElement = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;

        if (underlyingElement) {
            const simulatedEvent = new WheelEvent('wheel', {
                deltaX: event.deltaX,
                deltaY: event.deltaY,
                clientX: event.clientX,
                clientY: event.clientY,
                bubbles: true,
                cancelable: true,
                shiftKey: event.shiftKey
            });
            underlyingElement.dispatchEvent(simulatedEvent);
        }

        setTimeout(() => {
            target.style.pointerEvents = 'auto';
        }, 0);

        event.preventDefault();
        event.stopPropagation();
    }

    return <>
        <svg style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none"}}>
            <line ref={lineRef} 
                stroke={"rgba(41, 255, 41, 1)"}
                strokeWidth={1}
                style={{display: "none"}}
            />
        </svg>
        <Draggable nodeRef={dataBlockRef as RefObject<HTMLElement>}  allowAnyClick={true} handle=".inner">
            <span ref={dataBlockRef} className="inner" style={{position: "absolute", cursor: "grab", display: "none"}} onWheel={handleDataBlockWheel}>
                <div style={{ zIndex: 3, position: "absolute", transform: `translate(-50%, -50%)` }} className="dataBlock inner">
                    <p style={{margin: "0px"}}>{aircraft.callsign}</p>
                    <p style={{margin: "0px"}}>{aircraft.actualAircraftType}</p>
                </div>
            </span>
        </Draggable>
    </>
}
