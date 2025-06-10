import { Grid } from "@mui/material";
import type { BayName, StripData } from "../../types/common"
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useFlightPlans } from "../../hooks/useFlightPlans";
import { v4 as uuidv4 } from 'uuid';
import { StripPrinterStrip } from "./StripPrinterStrip";
import { useStrips } from "../../hooks/useStrips";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    setDraggedStrip: Dispatch<SetStateAction<StripData>>;
    handleStripInsert: (targetStrip: StripData) => void;
    selectedBay: BayName;
    setPrinterOpen: Dispatch<SetStateAction<boolean>>;
}

export function StripPrinter({setDraggedStrip, handleStripInsert, selectedBay, setPrinterOpen} : Props){
    const { flightPlans } = useFlightPlans();
    const { strips, setStrips, printerStrips } = useStrips();
    const [enteredCallsign, setEnteredCallsign] = useState("");
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedFlightPlan = flightPlans.find(flightPlan => flightPlan.callsign === enteredCallsign);

    function handleClickOutside(event: MouseEvent){
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setPrinterOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    function handleCallsignChange(event: React.ChangeEvent<HTMLInputElement>){
        setEnteredCallsign(event.target.value.toUpperCase());
    }

    function handleEnterPressed(event: React.KeyboardEvent){
        if(event.key === "Enter" && selectedFlightPlan){
            handleRequestStrip();
        }
    }

    function handleRequestStrip(){
        setEnteredCallsign("");
        if(!selectedFlightPlan){
            return;
        }
        setStrips((draft) => {
            draft.splice(0, 0, {
                ...selectedFlightPlan,
                bayName: "printer",
                id: uuidv4()
            });
        });
        setSelectedIndex(0);
    }

    function handleDeletePrinterStrip(printerStripIndex: number){
        setStrips((draft) => {
            const deleteIndex = strips.findIndex(strip => strip.id === printerStrips[printerStripIndex].id);
            draft.splice(deleteIndex, 1);
        });
    }

    function handleMoveToBay(printerStripIndex: number){
        setStrips((draft) => {
            const moveIndex = strips.findIndex(strip => strip.id === printerStrips[printerStripIndex].id);
            draft[moveIndex].bayName = selectedBay;
        });
    }

    function handleClosePrinter(){
        setPrinterOpen(false);
    }

    return (
        <div className="stripPrinter" ref={wrapperRef}>
            <div style={{textAlign: "right", marginBottom: "-20px"}}>
                <button style={{background: "none"}} onClick={handleClosePrinter}><CloseIcon></CloseIcon></button>
            </div>
            <p style={{fontSize: "24px", marginBottom: "20px", fontWeight: "500"}}>
                Flight Strip Printer
            </p>
            <Grid container style={{marginBottom: "15px"}} spacing={2}>
                <Grid size={"grow"} textAlign={"right"}>
                    <input type="text" className="stripPrinterInput" placeholder="AAL123" value={enteredCallsign} maxLength={8} onChange={handleCallsignChange} onKeyUp={handleEnterPressed} style={{height: "42.2px", border:"none", padding: "0px", textAlign: "center"}}></input>
                </Grid>
                <Grid size={"grow"} textAlign={"left"}>
                    <button className="stripPrinterInput" disabled={!selectedFlightPlan} style={{backgroundColor: "rgb(0, 188, 140)"}} onClick={handleRequestStrip}>Request Strip</button>
                </Grid>
            </Grid>
            <button className="stripPrinterInput" style={{backgroundColor: "rgb(63, 103, 145)"}}>Print Blank Strip</button>

            <hr style={{width: "80%", backgroundColor: "#fff", border: "none", height: "1px", marginTop: "20px", marginBottom: "20px"}} ></hr>

            <StripPrinterStrip setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} handleDeletePrinterStrip={handleDeletePrinterStrip} handleMoveToBay={handleMoveToBay} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}></StripPrinterStrip>
        </div>
    )
}
