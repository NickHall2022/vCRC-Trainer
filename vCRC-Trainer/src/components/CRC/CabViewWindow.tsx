import { useFlightPlans } from "../../hooks/useFlightPlans";
import { Airplane } from "./Airplane";
import { FlightPlanEditor } from "./FlightPlanEditor";

export function CabViewWindow(){
    const {flightPlans} = useFlightPlans();

    function createAirplanes() {
        return flightPlans.map(flightPlan => {
            return <Airplane flightPlan={flightPlan} key={flightPlan.callsign}></Airplane>
        })
    }
    
    return (
        <>
            <div id="cabViewContainer" className="preventSelect container" style={{position:"relative", overflow:"hidden", display: "inline-block", width: "fitContent"}}>
                <img src="/PWM.png" draggable={false} style={{objectFit: "cover", width: `100%`}}></img>
                {createAirplanes()}
            </div>
            <FlightPlanEditor></FlightPlanEditor>
        </>
    )
}
