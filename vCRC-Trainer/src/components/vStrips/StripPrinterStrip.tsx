import { type Dispatch, type SetStateAction } from "react";
import type { StripData } from "../../types/common";
import { Strip } from "./Strip";
import Grid from "@mui/material/Grid";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useStrips } from "../../hooks/useStrips";

type Props = {
    setDraggedStrip: Dispatch<SetStateAction<StripData>>;
    handleStripInsert: (targetStrip: StripData) => void;
    handleDeletePrinterStrip: (printerStripIndex: number) => void;
    handleMoveToBay: (printerStripIndex: number) => void;
    selectedIndex: number;
    setSelectedIndex: Dispatch<SetStateAction<number>>;
}

export function StripPrinterStrip({setDraggedStrip, handleStripInsert, handleDeletePrinterStrip, handleMoveToBay, selectedIndex, setSelectedIndex} : Props){
    const { printerStrips } = useStrips();
    
    if(printerStrips.length === 0){
        return <p style={{fontWeight: "500"}}>No new flight strips</p>;
    }

    function handleRightClicked(){
        setSelectedIndex((selectedIndex + 1) % printerStrips.length);
    }

    function handleLeftClicked(){
        let newIndex = selectedIndex - 1;
        if(newIndex < 0){
            newIndex = printerStrips.length -1;
        }
        setSelectedIndex(newIndex);
    }

    function deleteButtonClicked(){
        if(selectedIndex === (printerStrips.length - 1) && selectedIndex > 0){
            setSelectedIndex(selectedIndex - 1);
        }
        handleDeletePrinterStrip(selectedIndex)
    }

    return (
        <>
            <Grid container>
                <Grid size={"grow"}>
                    <button style={{marginTop: "15px", padding: "-15px", background: "none", lineHeight: "-15px", position: "relative", top: "-35px", left:"-10px", border: "none"}} onClick={handleLeftClicked}>
                        <ArrowLeftIcon style={{fontSize: "100px"}}></ArrowLeftIcon>
                    </button>
                </Grid>
                <Grid textAlign={"left"}>
                    <Strip stripData={printerStrips[selectedIndex]} index={0} setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} cssClass={"printerStrip"}></Strip>
                </Grid>
                <Grid size={"grow"}>
                    <button style={{marginTop: "15px", padding: "-15px", background: "none", lineHeight: "-15px", position: "relative", top: "-35px", left:"-52px", border: "none"}} onClick={handleRightClicked}>
                        <ArrowRightIcon style={{fontSize: "100px"}}></ArrowRightIcon>
                    </button>
                </Grid>
            </Grid>
            <p style={{marginTop: "-50px"}}>{selectedIndex + 1}/{printerStrips.length}</p>
            <Grid container spacing={2}>
                <Grid size={"grow"} textAlign={"right"}>
                    <button className="stripPrinterInput" style={{backgroundColor: "rgb(63, 103, 145)"}} onClick={() => handleMoveToBay(selectedIndex)}>Move to Bay</button>
                </Grid>
                <Grid size={"grow"} textAlign={"left"}>
                    <button className="stripPrinterInput" style={{marginBottom: "10px", backgroundColor: "rgb(231, 76, 60)"}} onClick={deleteButtonClicked}>Delete</button>
                </Grid>
            </Grid>
        </>
    );
}
