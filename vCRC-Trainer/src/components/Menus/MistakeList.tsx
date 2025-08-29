import { Grid } from "@mui/material";
import { useMistakes } from "../../hooks/useMistakes";
import { v4 as uuidv4 } from 'uuid';

function MistakeList(){
    const { mistakes } = useMistakes();
    console.log(mistakes)

    if(mistakes.length === 0){
        return <p style={{textAlign: "center"}}>No mistakes detected yet. Good work!</p>
    }

    let currentMistakes = mistakes.filter(mistake => mistake.type === "IFRAltFormat");
    let detailsList = currentMistakes.map(mistake => 
        <span key={uuidv4()}>
            <span className="flightPlanInput" style={{width: "60px", display: "inline-block"}}>{mistake.details?.length === 0? <>&nbsp;</> : mistake.details}</span>
        </span>
    );
    const IFRAltFormat = currentMistakes.length === 0 ? <></> : <div>
        <Grid container spacing={1}>
            <Grid>
                <p style={{margin: "0px"}}><b>IFR Altitude Format</b></p>
            </Grid>
            <Grid>
                <span className="mistakeCounter">{currentMistakes.length}</span>
            </Grid>
        </Grid>
        
        <p style={{margin: "0px"}}>IFR altitudes should be in ### format, such as 220 to indicate Flight Level 220, and should be in multiples of 1000 feet. See <b>General SOP 5.15.8</b></p>
        <p style={{margin: "0px"}}>You sent clearances with these incorrect altitudes: {detailsList}</p>
        <br></br>
    </div>

    currentMistakes = mistakes.filter(mistake => mistake.type === "badIFRAlt");
    detailsList = currentMistakes.map(mistake => 
        <span key={uuidv4()}>
            To <b>{mistake.secondaryDetails}</b>: <span className="flightPlanInput" style={{width: "60px", display: "inline-block"}}>{mistake.details}</span>&nbsp;
        </span>
    );
    const badIFRAlt = currentMistakes.length === 0 ? <></> : <div>
        <Grid container spacing={1}>
            <Grid>
                <p style={{margin: "0px"}}><b>Incorrect IFR Altitude</b></p>
            </Grid>
            <Grid>
                <span className="mistakeCounter">{currentMistakes.length}</span>
            </Grid>
        </Grid>
        
        <p style={{margin: "0px"}}>IFR cruise altitudes are related to their direction of flight. See <b>ATC Handbook 3.7</b></p>
        <p style={{margin: "0px"}}>You sent clearances with these incorrect altitudes: {detailsList}</p>
        <br></br>
    </div>

    currentMistakes = mistakes.filter(mistake => mistake.type === "badEquipment");
    detailsList = currentMistakes.map(mistake => 
        <span key={uuidv4()}>
            Type <b>{mistake.secondaryDetails}</b>: <span className="flightPlanInput" style={{width: "20px", display: "inline-block"}}>{mistake.details}</span>&nbsp;
        </span>
    );
    const badEquipment = currentMistakes.length === 0 ? <></> : <div>
        <Grid container spacing={1}>
            <Grid>
                <p style={{margin: "0px"}}><b>Incorrect Equipment</b></p>
            </Grid>
            <Grid>
                <span className="mistakeCounter">{currentMistakes.length}</span>
            </Grid>
        </Grid>
        
        <p style={{margin: "0px"}}>Ensure that the equipment code makes sense for the filed aircraft type and route. See <b>General SOP 5.13.4</b></p>
        <p style={{margin: "0px"}}>You sent clearances with these incorrect equipment codes: {detailsList}</p>
        <br></br>
    </div>

    currentMistakes = mistakes.filter(mistake => mistake.type === "badRoute");
    detailsList = currentMistakes.map(mistake => 
        <span key={uuidv4()}>
            To <b>{mistake.secondaryDetails}</b>: <span className="flightPlanInput" style={{display: "inline-block", textAlign: "left", paddingLeft: "5px", paddingRight: "5px"}}>{mistake.details}</span>&nbsp;
        </span>
    );
    const badRoute = currentMistakes.length === 0 ? <></> : <div>
        <Grid container spacing={1}>
            <Grid>
                <p style={{margin: "0px"}}><b>Incorrect Route</b></p>
            </Grid>
            <Grid>
                <span className="mistakeCounter">{currentMistakes.length}</span>
            </Grid>
        </Grid>
        
        <p style={{margin: "0px"}}>When possible, assign aircraft to preferred routes found in the IDS. <i> Note: there may exist valid routes that vSweatbox is missing, 
            use your best judgement.</i> See <b>General SOP 7.6</b></p>
        <p style={{margin: "0px"}}>You sent clearances with these incorrect routes: {detailsList}</p>
        <br></br>
    </div>

    return <>
        {IFRAltFormat}
        {badIFRAlt}
        {badEquipment}
        {badRoute}
    </>
}

export default MistakeList;