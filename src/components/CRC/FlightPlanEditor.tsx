import { Grid } from "@mui/material";
import { useFlightPlans } from "../../hooks/useFlightPlans";
import type { FlightPlan } from "../../types/common";
import { useState, useEffect, useRef, type RefObject } from "react";
import Draggable from "react-draggable";
import { makeEmptyFlightPlan } from "../../utils/flightPlans";
import { useStrips } from "../../hooks/useStrips";

export function FlightPlanEditor(){
    const { selectedFlightPlan, amendFlightPlan, setSelectedFlightPlan, flightPlans } = useFlightPlans();
    const { printAmendedFlightPlan } = useStrips();

    const draggableRef = useRef<HTMLDivElement>(null);

    const [flightPlan, setFlightPlan] = useState<FlightPlan>(handleNewSelectedFlightPlan(selectedFlightPlan));
    const [hasBeenEdited, setHasBeenEdited] = useState(false);
    const callsignInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFlightPlan(handleNewSelectedFlightPlan(selectedFlightPlan));
        setHasBeenEdited(false);
    }, [setFlightPlan, selectedFlightPlan, setHasBeenEdited, handleNewSelectedFlightPlan])

    useEffect(() => {
        document.addEventListener("keydown", handleControlF);
        return () => {
            document.removeEventListener("keydown", handleControlF);
        }
    }, []);

    function handleControlF(event: KeyboardEvent){
        if(event.key === "f" && event.ctrlKey){
            event.preventDefault();
            setFlightPlan(handleNewSelectedFlightPlan(undefined));
            callsignInputRef.current?.focus();
        }
    }

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
        const latestFlightPlan = flightPlans.find(flight => flight.callsign === flightPlan.callsign);
        if(!latestFlightPlan){
            throw new Error("flight plan not properly selected");
        }
        const amendedFlightPlan: FlightPlan = { ...latestFlightPlan, 
            printCount: flightPlan.printCount + 1, 
            created: true,
            aircraftType: flightPlan.aircraftType,
            equipmentCode: flightPlan.equipmentCode,
            departure: flightPlan.departure,
            destination: flightPlan.destination,
            speed: flightPlan.speed,
            altitude: flightPlan.altitude,
            route: flightPlan.route,
            remarks: flightPlan.remarks
        };
        if(amendedFlightPlan.equipmentCode.length === 0){
            amendedFlightPlan.equipmentCode = "A";
        }
        
        amendFlightPlan(amendedFlightPlan);
        printAmendedFlightPlan(amendedFlightPlan);
        setFlightPlan(amendedFlightPlan);
    }

    function handleEnterPressed(event: React.KeyboardEvent){
        if(event.key === "Enter" && hasBeenEdited){
            handleAmendFlightPlan(); 
        }
    }

    function handleCallsignChange(callsign: string){
        setSelectedFlightPlan(callsign);
    }

    const editButtonEnabled = (flightPlan.created && hasBeenEdited) || (!flightPlan.created && flightPlan.squawk !== "");

    return (
        <Draggable nodeRef={draggableRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".handle">
            <div className="preventSelect" ref={draggableRef} style={{width: "620px", height: "155px", backgroundColor: "#090909", position: "absolute", top: "1%", left: "580px", zIndex: 3}} onKeyDown={handleEnterPressed}>
                <div className="handle" style={{backgroundColor: "#151515", margin: "0px", marginBottom: "2px"}}>
                    <p style={{margin: "0px", marginLeft: "4px", fontSize: "11px"}}>Flight Plan Editor</p>
                </div>
                <Grid container columnSpacing={1} style={{textAlign: "center", fontSize: "14px", marginBottom: "3px"}}>
                    <Grid size={1}></Grid>
                    <Grid size={"auto"}>
                        AID
                        <br></br>
                        <input className="flightPlanInput" maxLength={8} ref={callsignInputRef} value={flightPlan?.callsign} onChange={(event)=>handleCallsignChange(event.target.value.toUpperCase())} style={{width: "60px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        BCN
                        <br></br>
                        <input className="flightPlanInput flightPlanReadonly" disabled={true} maxLength={4} defaultValue={flightPlan.created ? flightPlan?.squawk : ""} style={{width: "40px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        TYP
                        <br></br>
                        <input className="flightPlanInput" maxLength={4} value={flightPlan?.aircraftType} onChange={(event)=>handleTextInput("aircraftType", event.target.value.toUpperCase())} style={{width: "40px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        EQ
                        <br></br>
                        <input className="flightPlanInput" maxLength={1} value={flightPlan?.equipmentCode} onChange={(event)=>handleTextInput("equipmentCode", event.target.value.toUpperCase())} style={{width: "20px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        DEP
                        <br></br>
                        <input className="flightPlanInput" maxLength={4} value={flightPlan?.departure} onChange={(event)=>handleTextInput("departure", event.target.value.toUpperCase())} style={{width: "40px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        DEST
                        <br></br>
                        <input className="flightPlanInput" maxLength={4} value={flightPlan?.destination} onChange={(event)=>handleTextInput("destination", event.target.value.toUpperCase())} style={{width: "40px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        SPD
                        <br></br>
                        <input step="none" className="flightPlanInput" maxLength={4} value={flightPlan?.speed} onChange={(event)=>handleTextInput("speed", event.target.value.replace(/\D/g, ""))} style={{width: "40px"}}></input>
                    </Grid>
                    <Grid size={"auto"}>
                        ALT
                        <br></br>
                        <input className="flightPlanInput" maxLength={7} value={flightPlan?.altitude} onChange={(event)=>handleTextInput("altitude", event.target.value.toUpperCase())} style={{width: "60px"}}></input>
                    </Grid>
                    <Grid size={1}>
                        <button disabled={!editButtonEnabled}  style={{marginTop: "6px"}} className="amendFlightPlanButton" onClick={handleAmendFlightPlan}>{flightPlan.created ? "Amend" : "Create"}</button>
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
