import { Grid } from "@mui/material";
import { useRef, type RefObject } from "react";
import Draggable from "react-draggable";

export function ControllerList(){
    const draggableRef = useRef<HTMLDivElement>(null);
    
    return (
        <Draggable nodeRef={draggableRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".handle">
            <div ref={draggableRef} style={{width: "235px", height: "165px", backgroundColor: "#090909", position: "absolute", top: "80%", left: "590px", zIndex: 3, fontSize: "13px"}}>
                <div className="handle" style={{backgroundColor: "#151515", margin: "0px", marginBottom: "2px"}}>
                    <p style={{margin: "0px", marginLeft: "4px", fontSize: "11px"}}>Controllers</p>
                </div>
                <p className="controllersHeader">ZBW - Boston ARTCC</p>
                <Grid container spacing={1}>
                    <Grid size={2}><span className="controllersListItem" style={{marginLeft: "10px"}}>C37</span></Grid>
                    <Grid size={7}><span className="controllersListItem">Concord 37</span></Grid>
                    <Grid size={3}><span className="controllersListItem">134.700</span></Grid>
                </Grid>
                <p className="controllersHeader">CASCO - Portland TRACON</p>
                <Grid container spacing={1}>
                    <Grid size={2}><span className="controllersListItem" style={{marginLeft: "10px"}}>C37</span></Grid>
                    <Grid size={7}><span className="controllersListItem">Portland Departure</span></Grid>
                    <Grid size={3}><span className="controllersListItem">119.750</span></Grid>
                </Grid>
                <p className="controllersHeader">PWM - Portland ATCT</p>
                <Grid container spacing={1}>
                    <Grid size={2}><span className="controllersListItemActive" style={{marginLeft: "10px"}}>1G</span></Grid>
                    <Grid size={7}><span className="controllersListItemActive">Ground Control</span></Grid>
                    <Grid size={3}><span className="controllersListItemActive">121.900</span></Grid>
                    
                </Grid>
                <Grid container spacing={1}>
                    <Grid size={2}><span className="controllersListItem" style={{marginLeft: "10px"}}>1T</span></Grid>
                    <Grid size={7}><span className="controllersListItem">Local Control</span></Grid>
                    <Grid size={3}><span className="controllersListItem">120.900</span></Grid>
                </Grid>
            </div>
        </Draggable>
    )
}
  