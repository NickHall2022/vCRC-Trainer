import { Grid } from "@mui/material";
import type { AbstractStrip } from "../../types/common"
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useFlightPlans } from "../../hooks/useFlightPlans";
import { StripPrinterStrip } from "./StripPrinterStrip";
import { useStrips } from "../../hooks/useStrips";
import CloseIcon from '@mui/icons-material/Close';
import { makeEmptyFlightPlan } from "../../assets/flightPlans";
import { v4 as uuidv4 } from 'uuid';

type Props = {
    setDraggedStrip: Dispatch<SetStateAction<AbstractStrip>>;
    handleStripInsert: (targetStrip: AbstractStrip) => void;
    setPrinterOpen: Dispatch<SetStateAction<boolean>>;
}

export function StripPrinter({setDraggedStrip, handleStripInsert, setPrinterOpen} : Props){
    const { flightPlans, amendFlightPlan } = useFlightPlans();
    const { strips, setStrips, printerStrips, printAmendedFlightPlan, printStrip } = useStrips();
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
        const amendedFlightPlan = {...selectedFlightPlan, printCount: selectedFlightPlan.printCount + 1};
        amendFlightPlan(amendedFlightPlan);
        printAmendedFlightPlan(amendedFlightPlan)
        setSelectedIndex(0);
    }

    function handleDeletePrinterStrip(printerStripIndex: number){
        setStrips((draft) => {
            const deleteIndex = strips.findIndex(strip => strip.id === printerStrips[printerStripIndex].id);
            draft.splice(deleteIndex, 1);
        });
    }

    function handleClosePrinter(){
        setPrinterOpen((prev) => !prev);
    }

    function printBlankStrip() {
        const flightPlan = makeEmptyFlightPlan();
        printStrip({
            ...flightPlan,
            type: "blank",
            id: uuidv4(),
            bayName: "printer",
            offset: false
        })
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
            <button className="stripPrinterInput" style={{backgroundColor: "rgb(63, 103, 145)"}} onClick={printBlankStrip}>Print Blank Strip</button>

            <hr style={{width: "80%", backgroundColor: "#fff", border: "none", height: "1px", marginTop: "20px", marginBottom: "20px"}} ></hr>

            <StripPrinterStrip setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert} handleDeletePrinterStrip={handleDeletePrinterStrip} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}></StripPrinterStrip>
        </div>
    )
}
