import { useState } from "react"
import type { BayName, StripData } from "../types/flightPlan"
import { Strip } from "./Strip"
import { useFlightPlans } from "../hooks/useFlightPlans"
import Grid from "@mui/material/Grid";
import { useImmer } from "use-immer";
import { StripPrinter } from "./StripPrinter";
import { v4 as uuidv4 } from 'uuid';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';

export function StripsWindow(){
    const { flightPlans } = useFlightPlans();
    const [strips, setStrips] = useImmer<StripData[]>(() => {
        return flightPlans.map(flightPlan => {
            return {...flightPlan, bayName: "printer", id: uuidv4()};
        });
    });

    const [selectedBay, setSelectedBay] = useState<BayName>("ground");
    const [printerOpen, setPrinterOpen] = useState(false);
    const [draggedStrip, setDraggedStrip] = useState<StripData>({} as StripData);

    const visibleBayStrips = strips.filter(strip => strip.bayName === selectedBay);

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
        const draggedIndex = strips.findIndex(strip => strip.id === draggedStrip.id);
        executeInsert(visibleBayStrips.length, draggedIndex);
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

    return (
        <div className="preventSelect container" style={{position:"relative", height: "100vh", width: "550px"}}>
            <Grid container className="stripsBar" style={{backgroundColor:"#1a1a1a", padding: "5px"}} textAlign={"center"}>
                <Grid size={"grow"}>
                    <button className={`stripsBarButton${selectedBay === "ground" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("ground")} onDrop={() => handleBayButtonDropped("ground")} onDragOver={handleDragOver}>Ground</button>
                </Grid>
                <Grid size={"grow"}>
                    <button className={`stripsBarButton${selectedBay === "local" ? ' selected' : ''}`} onClick={() => handleBayButtonClicked("local")} onDrop={() => handleBayButtonDropped("local")} onDragOver={handleDragOver}>Local</button>
                </Grid>
                <Grid size={"grow"}>
                    <button className="stripsBarPrintButton" onDrop={handleDeleteStrip} onDragOver={handleDragOver} style={{marginRight: "8px", padding: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                        <DeleteIcon></DeleteIcon>
                    </button>
                    <button className="stripsBarPrintButton" onClick={() => handleBayButtonClicked("printer")} style={{padding: "10px", paddingTop: "5px", paddingBottom: "5px"}}>
                        <PrintIcon></PrintIcon>
                    </button>
                </Grid>
            </Grid>
            <img src="/stripBay.png" draggable={false} style={{width: "100%", height: "100%"}} onDrop={handleDrop} onDragOver={handleDragOver}></img>
            {createStrips()}
            {printerOpen && (
                <StripPrinter strips={strips} setStrips={setStrips} setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} selectedBay={selectedBay} setPrinterOpen={setPrinterOpen}></StripPrinter>
            )}
        </div>
    )
}