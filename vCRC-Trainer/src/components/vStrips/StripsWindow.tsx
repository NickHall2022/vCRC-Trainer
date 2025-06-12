import { useState } from "react"
import type { AbstractStrip, BayName } from "../../types/common"
import Grid from "@mui/material/Grid";
import { StripPrinter } from "./StripPrinter";
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStrips } from "../../hooks/useStrips";
import { StripsBay } from "./StripsBay";

export function StripsWindow(){
    const { setStrips, printerStrips, deleteStrip, selectedBay, setSelectedBay, moveStripToBay } = useStrips();

    const [printerOpen, setPrinterOpen] = useState(false);
    const [draggedStrip, setDraggedStrip] = useState<AbstractStrip>({} as AbstractStrip);

    function handleStripInsert(targetStrip: AbstractStrip){
        setStrips((draft) => {
            const draggedIndex = draft.findIndex(strip => strip.id === draggedStrip.id);
            const droppedIndex = draft.findIndex(strip => strip.id === targetStrip.id);
            const [removedStrip] = draft.splice(draggedIndex, 1);
            removedStrip.bayName = selectedBay;
            draft.splice(droppedIndex, 0, removedStrip);
        });
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
                removedStrip.offset = false;
                draft.push(removedStrip);
            }
        });
    }

    function handleBarDragOver(event: React.DragEvent){
        if(draggedStrip.type !== "divider"){
            event.preventDefault();
        }
    }

    return (
        <div className="preventSelect container" style={{position:"relative", height: "100vh", width: "570px", overflowX: "visible"}}>
            <div style={{zIndex: "2", position: "relative", width: "550px"}}>
                <Grid container className="stripsBar" style={{backgroundColor:"#1a1a1a", padding: "5px"}} textAlign={"center"}>
                    <Grid size={"grow"}>
                        <button className={`stripsBarButton${selectedBay === "ground" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("ground")} onDrop={() => handleBayButtonDropped("ground")} onDragOver={handleBarDragOver}>GC</button>
                    </Grid>
                    <Grid size={"grow"}>
                        <button className={`stripsBarButton${selectedBay === "local" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("local")} onDrop={() => handleBayButtonDropped("local")} onDragOver={handleBarDragOver}>LC</button>
                    </Grid>
                    <Grid size={"grow"}>
                        <button className={`stripsBarButton${selectedBay === "spare" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("spare")} onDrop={() => handleBayButtonDropped("spare")} onDragOver={handleBarDragOver}>SPARE</button>
                    </Grid>
                    <Grid size={"grow"}>
                        <button className="stripsBarPrintButton" onDrop={() => deleteStrip(draggedStrip.id)} onDragOver={handleBarDragOver} style={{marginRight: "8px", padding: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                            <DeleteIcon></DeleteIcon>
                        </button>
                        <button className="stripsBarPrintButton" onClick={() => handleBayButtonClicked("printer")} style={{padding: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                            <PrintIcon></PrintIcon>
                        </button>
                        {printerStrips.length > 0 && <span style={{backgroundColor: "red", width: "18px", height: "18px", display: "block", position: "absolute", top: "0px", left: "515px", zIndex: "10001", borderRadius: "10px", fontSize: "12px"}}>{printerStrips.length}</span>}
                    </Grid>
                </Grid>
            </div>
            <StripsBay handleDrop={() => moveStripToBay(draggedStrip, selectedBay)} setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert}></StripsBay>
            {printerOpen && (
                <StripPrinter setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} printerOpen={printerOpen} setPrinterOpen={setPrinterOpen}></StripPrinter>
            )}
        </div>
    )
}
