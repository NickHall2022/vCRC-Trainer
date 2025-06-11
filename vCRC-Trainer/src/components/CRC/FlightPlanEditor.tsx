import { Grid } from "@mui/material";
import { useFlightPlans } from "../../hooks/useFlightPlans";
import type { FlightPlan } from "../../types/common";
import { useState, useEffect, useRef, type RefObject } from "react";
import Draggable from "react-draggable";
import { makeEmptyFlightPlan } from "../../assets/flightPlans";
import { useStrips } from "../../hooks/useStrips";

export function FlightPlanEditor(){
    const {selectedFlightPlan, amendFlightPlan} = useFlightPlans();
    const {printAmendedFlightPlan} = useStrips();

    const draggableRef = useRef<HTMLDivElement>(null);

    const [flightPlan, setFlightPlan] = useState<FlightPlan>(handleNewSelectedFlightPlan(selectedFlightPlan));
    const [hasBeenEdited, setHasBeenEdited] = useState(false);

    useEffect(() => {
        setFlightPlan(handleNewSelectedFlightPlan(selectedFlightPlan));
        setHasBeenEdited(false);
    }, [setFlightPlan, selectedFlightPlan])

    function handleTextInput(fieldType: keyof FlightPlan, value: string){
        setFlightPlan((prev) => {
            if(prev[fieldType] !== value){
                setHasBeenEdited(true);
            }
            return {...prev, [fieldType]: value}
        })
    }

    function handleAmendFlightPlan(){
        setHasBeenEdited(false);
        const amendedFlightPlan = {...flightPlan, printCount: flightPlan.printCount + 1};
        amendFlightPlan(amendedFlightPlan);
        printAmendedFlightPlan(amendedFlightPlan);
    }

    function handleEnterPressed(event: React.KeyboardEvent){
        if(event.key === "Enter" && hasBeenEdited){
           handleAmendFlightPlan(); 
        }
    }

    return (
        <Draggable nodeRef={draggableRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".handle">
            <div className="preventSelect" ref={draggableRef} style={{width: "620px", height: "155px", backgroundColor: "#090909", position: "absolute", top: "75%", left: "35%", zIndex: 3}} onKeyDown={handleEnterPressed}>
                <div className="handle" style={{backgroundColor: "#151515", margin: "0px", marginBottom: "2px"}}>
                    <p style={{margin: "0px", marginLeft: "4px", fontSize: "11px"}}>Flight Plan Editor</p>
                </div>
                <Grid container columnSpacing={1} style={{textAlign: "center", fontSize: "14px"}}>
                    <Grid size={"auto"}></Grid>
                    <Grid size={2}>
                        AID
                        <input className="flightPlanInput flightPlanReadonly" style={{width: "100%"}} defaultValue={flightPlan?.callsign}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        BCN
                        <br></br>
                        <input className="flightPlanInput flightPlanReadonly" size={4} maxLength={4} defaultValue={flightPlan?.squawk}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        TYP
                        <br></br>
                        <input className="flightPlanInput" size={4} maxLength={4} value={flightPlan?.aircraftType} onChange={(event)=>handleTextInput("aircraftType", event.target.value.toUpperCase())}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        EQ
                        <br></br>
                        <input className="flightPlanInput" size={1} maxLength={1} value={flightPlan?.equipmentCode} onChange={(event)=>handleTextInput("equipmentCode", event.target.value.toUpperCase())}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        DEP
                        <br></br>
                        <input className="flightPlanInput" size={4} maxLength={4} value={flightPlan?.departure} onChange={(event)=>handleTextInput("departure", event.target.value.toUpperCase())}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        DEST
                        <br></br>
                        <input className="flightPlanInput" size={4} maxLength={4} value={flightPlan?.destination} onChange={(event)=>handleTextInput("destination", event.target.value.toUpperCase())}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        SPD
                        <br></br>
                        <input step="none" className="flightPlanInput" size={4} maxLength={4} value={flightPlan?.speed} onChange={(event)=>handleTextInput("speed", event.target.value.replace(/\D/g, ""))}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        ALT
                        <br></br>
                        <input className="flightPlanInput" size={6} maxLength={6} value={flightPlan?.altitude} onChange={(event)=>handleTextInput("altitude", event.target.value.toUpperCase())}></input>
                    </Grid>
                    <Grid size={"grow"}>
                        <button disabled={!hasBeenEdited}  style={{marginTop: "6px"}} className="amendFlightPlanButton" onClick={handleAmendFlightPlan}>Amend</button>
                    </Grid>
                </Grid>
                <Grid container spacing={0.5}>
                    <Grid size={1} style={{textAlign: "right", fontSize: "14px"}}>
                        RTE
                    </Grid>
                    <Grid size={"grow"}>
                        <textarea className="flightPlanTextArea" rows={2} value={flightPlan?.route} onChange={(event)=>handleTextInput("route", event.target.value.toUpperCase())} autoComplete="off" autoCorrect="off" spellCheck="false"></textarea>
                    </Grid>
                </Grid>
                <Grid container spacing={0.5}>
                    <Grid size={1} style={{textAlign: "right", fontSize: "14px"}}>
                        RMK
                    </Grid>
                    <Grid size={"grow"}>
                        <textarea className="flightPlanTextArea" rows={2} value={flightPlan?.remarks} onChange={(event)=>handleTextInput("remarks", event.target.value)} autoComplete="off" autoCorrect="off" spellCheck="false"></textarea>
                    </Grid>
                </Grid>
            </div>
        </Draggable>
    )
}

function handleNewSelectedFlightPlan(selectedFlightPlan: FlightPlan | undefined){
    if(selectedFlightPlan){
        return {...selectedFlightPlan};
    }
    return makeEmptyFlightPlan();
}
