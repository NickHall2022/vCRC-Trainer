import { useState } from "react"
import type { BayName, StripData } from "../../types/common"
import { Strip } from "./Strip"
import Grid from "@mui/material/Grid";
import { StripPrinter } from "./StripPrinter";
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStrips } from "../../hooks/useStrips";
import { isStripDividerStrip } from "../../utils/stripUtils";

export function StripsWindow(){
    const { strips, setStrips, printerStrips } = useStrips();

    const [selectedBay, setSelectedBay] = useState<BayName>("ground");
    const [printerOpen, setPrinterOpen] = useState(false);
    const [draggedStrip, setDraggedStrip] = useState<StripData>({} as StripData);

    function executeInsert(droppedIndex: number, draggedIndex: number){
        setStrips((draft) => {
            const [draggedStrip] = draft.splice(draggedIndex, 1);
            draggedStrip.bayName = selectedBay;
            draft.splice(droppedIndex, 0, draggedStrip);
        });
    }

    function handleStripInsert(targetStrip: StripData){
        const draggedIndex = strips.findIndex(strip => strip.id === draggedStrip.id);
        const droppedIndex = strips.findIndex(strip => strip.id === targetStrip.id);
        executeInsert(droppedIndex, draggedIndex)
    }

    function createStrips(){
        return strips.filter(strip => strip.bayName === selectedBay).map((strip, index) => {
            return <Strip stripData={strip} key={strip.id} index={index} setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} cssClass={"bayStrip"}></Strip>
        })
    }

    function handleDrop(){
        setStrips((draft) => {
            const draggedIndex = draft.findIndex(strip => strip.id === draggedStrip.id);
            const [removedStrip] = draft.splice(draggedIndex, 1);
            removedStrip.bayName = selectedBay;
            draft.push(removedStrip);
        })
    }
    
    function handleDragOver(event: React.DragEvent){
        event.preventDefault();
    }

    function handleBayButtonClicked(bayName: BayName){
        if(bayName !== "printer"){
            setSelectedBay(bayName);
        } else {
            setPrinterOpen(!printerOpen);
        }
    }

    function handleBayButtonDropped(bayName: BayName){
        setStrips((draft) => {
            if(draggedStrip.bayName !== bayName){
                const updateIndex = draft.findIndex(strip => strip.id === draggedStrip.id);
                const removedStrip = draft.splice(updateIndex, 1)[0];
                removedStrip.bayName = bayName;
                draft.push(removedStrip);
            }
        });
    }

    function handleDeleteStrip(){
        setStrips((draft) => {
            const draggedIndex = strips.findIndex(strip => strip.id === draggedStrip.id);
            draft.splice(draggedIndex, 1);
        });
    }

    function handleBarDragOver(event: React.DragEvent){
        if(!isStripDividerStrip(draggedStrip)){
            event.preventDefault();
        }
    }

    return (
        <div className="preventSelect container" style={{position:"relative", height: "100vh", width: "550px"}}>
            <div style={{zIndex: "2", position: "relative"}}>
                <Grid container className="stripsBar" style={{backgroundColor:"#1a1a1a", padding: "5px"}} textAlign={"center"}>
                    <Grid size={"grow"}>
                        <button className={`stripsBarButton${selectedBay === "ground" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("ground")} onDrop={() => handleBayButtonDropped("ground")} onDragOver={handleBarDragOver}>GC</button>
                    </Grid>
                    <Grid size={"grow"}>
                        <button className={`stripsBarButton${selectedBay === "local" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("local")} onDrop={() => handleBayButtonDropped("local")} onDragOver={handleBarDragOver}>LC</button>
                    </Grid>
                    <Grid size={"grow"}>
                        <button className="stripsBarPrintButton" onDrop={handleDeleteStrip} onDragOver={handleBarDragOver} style={{marginRight: "8px", padding: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                            <DeleteIcon></DeleteIcon>
                        </button>
                        <button className="stripsBarPrintButton" onClick={() => handleBayButtonClicked("printer")} style={{padding: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                            <PrintIcon></PrintIcon>
                        </button>
                        {printerStrips.length > 0 && <span style={{backgroundColor: "red", width: "15px", height: "15px", display: "block", position: "absolute", top: "0px", left: "495px", zIndex: "10001", borderRadius: "10px", fontSize: "10px"}}>{printerStrips.length}</span>}
                    </Grid>
                </Grid>
            </div>
            <img src="/stripBay.png" draggable={false} style={{width: "100%", height: "100%"}} onDrop={handleDrop} onDragOver={handleDragOver}></img>
            {createStrips()}
            {printerOpen && (
                <StripPrinter setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} selectedBay={selectedBay} setPrinterOpen={setPrinterOpen}></StripPrinter>
            )}
        </div>
    )
}