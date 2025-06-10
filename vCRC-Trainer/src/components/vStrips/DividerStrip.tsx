import type { Dispatch, SetStateAction } from "react";
import type { StripData } from "../../types/common";

type Props = {
    stripData: StripData, 
    index: number, 
    setDraggedStrip: Dispatch<SetStateAction<StripData>>, 
    handleStripInsert: (targetStrip: StripData) => void
}

export function DividerStrip({stripData, index, setDraggedStrip, handleStripInsert}: Props){

    function handleDragStart(){
        setDraggedStrip(stripData);
    }

    function handleDrop(){
        handleStripInsert(stripData)
    }
    
    function handleDragOver(event: React.DragEvent){
        event.preventDefault();
    }

    const style: React.CSSProperties = {
        backgroundImage: `url(/${stripData.callsign}.png)`,
        objectFit: "contain",
        width: "100%",
        height: "76px",
        position: "absolute", 
        left: "0px", 
        bottom: `${76 * index}px`,
        zIndex: 1
    }

    return (
        <div style={style} draggable={true} className={"container"} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} >
        </div>
    )
}
