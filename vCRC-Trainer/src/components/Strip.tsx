import type { Dispatch, SetStateAction } from "react";
import type { StripData } from "../types/flightPlan";

type Props = {
    stripData: StripData, 
    index: number, 
    setDraggedStrip: Dispatch<SetStateAction<StripData>>, 
    handleStripInsert: (targetStrip: StripData) => void,
    cssClass: string
}

export function Strip({stripData, index, setDraggedStrip, handleStripInsert, cssClass}: Props){

    function handleDragStart(){
        setDraggedStrip(stripData);
    }

    function handleDrop(){
        handleStripInsert(stripData)
    }
    
    function handleDragOver(event: React.DragEvent){
        if(cssClass === "bayStrip"){
            event.preventDefault();
        }
    }

    const baseStyle: React.CSSProperties = {
        backgroundImage: "url(/strip.png)",
        color: "black",
        width: "100%",
        height: "80px",
        position: "relative",
        fontSize: "14px",
        lineHeight: "25px",
        fontFamily: "monospace"
    }

    const style: React.CSSProperties = cssClass === "bayStrip" ? {
        ...baseStyle,
        position: "absolute", 
        left: "0px", 
        bottom: `${80 * index}px`
    } : {
        ...baseStyle,
        width: "550px",
        height: "76px"
    }

    const routeLines = splitIntoThreeParts(stripData)

    return (
        <div className={cssClass} style={style} draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} >
            <div style={{position: "absolute", left: "5px"}}>
                {stripData.callsign}
                <br></br>
                {stripData.aircraftType}/{stripData.equipmentCode}
                <br></br>
                {stripData.CID}
            </div>
            <div style={{position: "absolute", left: "127px"}}>
                {stripData.squawk}
                <br></br>
                P2100
                <br></br>
                {stripData.altitude}
            </div>
            <div style={{position: "absolute", left: "173px"}}>
                {stripData.departure}
            </div>
            <div style={{position: "absolute", left: "248px"}}>
                {routeLines[0]}
                <br></br>
                {routeLines[1]}
                <br></br>
                {routeLines[2]}
            </div>
            
        </div>
    )
}

function splitIntoThreeParts(stripData: StripData) {
    let maxLength = 26;
    const words = stripData.route.split(' ');
    const lines = ['', '', ''];
    let lineIndex = 0;

    for (const word of words) {
        if (word.length > maxLength) {
            continue;
        }

        if ((lines[lineIndex] + word).length + (lines[lineIndex] ? 1 : 0) > maxLength) {
            if(lineIndex === 1){
                maxLength = 19;
            }
            lineIndex++;
            
            if (lineIndex > 2) {
                lines[2] += "***" + stripData.destination;
                return lines;
            }
        }

        lines[lineIndex] += (lines[lineIndex] ? ' ' : '') + word;
    }

    return lines;
}
