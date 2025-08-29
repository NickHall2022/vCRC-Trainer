import { Box, Grid } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { useDifficulty } from "../../hooks/useDifficulty";
import { useSimulation } from "../../hooks/useSimulation";

type Props = {
    setHelpOpen: Dispatch<SetStateAction<boolean>>;
}

function Help({setHelpOpen} : Props) {
    const { setPaused } = useSimulation();
    const { difficulty, setDifficulty } = useDifficulty();

    function handleResumeClicked(){
        setHelpOpen(false);
        setPaused(false);
    }

    return (
        <div style={{backgroundImage: "url(blurredBackground.png)", backgroundSize: "cover", width: "100vw", height: "100vh"}}>
            <Box className="welcome" sx={{overflowY: "scroll", maxHeight: "90vh"}}>
                <h3>How to:</h3>
                <p>
                    This system is designed to reflect the simplified operation of vStrips and CRC as much as possible. It will be helpful
                    to familiarize yourself with the <a href="https://strips.virtualnas.net/docs/#/" target="_blank">vStrips documentation</a> and  
                    <a href="https://strips.virtualnas.net/docs/#/" target="_blank"> CRC documentation</a>. Here is a quick list of common commands:
                </p>
                
                <ul>
                    <li>
                        <code style={{border: "1px solid #999", borderRadius: 3, padding: "2px"}}><b>Left Click</b></code> on a plane or its message to issue it a command
                    </li>
                    <li>
                        <code style={{border: "1px solid #999", borderRadius: 3, padding: "2px"}}><b>CTRL + Click</b></code> on a plane to open its flight plan
                    </li>
                    <li>
                        <code style={{border: "1px solid #999", borderRadius: 3, padding: "2px"}}><b>CTRL + F</b></code> to search flight plan by callsign
                    </li>
                    <li>
                        <code style={{border: "1px solid #999", borderRadius: 3, padding: "2px"}}><b>Mousewheel</b></code> to zoom cab view
                    </li>
                    <li>
                        <code style={{border: "1px solid #999", borderRadius: 3, padding: "2px"}}><b>SHIFT + Mousewheel</b></code> to rotate cab view
                    </li>
                    <li>
                        <code style={{border: "1px solid #999", borderRadius: 3, padding: "2px"}}><b>Right Click + Drag</b></code> to pan cab view
                    </li>
                </ul>

                <hr></hr>

                <h3>FAQs:</h3>
                <ul>
                    <li><b>How do I...?</b> See the section above</li>
                    <li><b>Why are the planes not behaving like I expect?</b> This is a simplified simulation, where the planes will assume that you've given them
                    correct instructions. When they send you a request through the message window, do your best to respond to it out loud like you would a to real pilot, 
                    and then click the plane to tell it you are finished.</li>
                    <li><b>What if I'm not sure I'm doing it right?</b> As you come across things you aren't sure about, make note of those things and go back to review them.
                    The information is very likely in documentation somewhere. Observing the live network can also be a great way to confirm your understanding. Be sure also
                    to review the Mistake Tracker tool through the button at the bottom right of the screen at the end of your vSweatbox session, which will automatically
                    keep track of some types of errors.</li>
                    <li><b>How can I change the difficulty?</b> You can start over by refreshing the page at any time &#x28;progress will be lost!&#x29;, or adjust the difficulty 
                    right here and keep your progress:</li>
                </ul>

                <div>
                    <Grid container spacing={3}>
                        <Grid size={"auto"}>
                            <b>Beginner</b>
                        </Grid>
                        <Grid size={"grow"}>
                            <input type="range" min="1" max="4" defaultValue={difficulty} style={{width: "100%"}} onChange={(event) => setDifficulty(Number(event.target.value))}></input>
                        </Grid>
                        <Grid size={"auto"}>
                            <b>Veteran</b>
                        </Grid>
                    </Grid>
                </div>

                <br></br>

                <div style={{textAlign: "center"}}>
                    <button style={{backgroundColor: "#444", padding: "20px", border: "1px solid white"}} onClick={handleResumeClicked}>Resume</button>
                </div>
            </Box>
        </div>
    )
}

export default Help