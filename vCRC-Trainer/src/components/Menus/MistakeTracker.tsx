import { Box, Grid } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { useSimulation } from "../../hooks/useSimulation";
import { useMistakes } from "../../hooks/useMistakes";

type Props = {
    setOpen: Dispatch<SetStateAction<boolean>>;
}

function MistakeTracker({setOpen} : Props) {
    const { setPaused } = useSimulation();
    const { mistakes } = useMistakes();

    function handleResumeClicked(){
        setOpen(false);
        setPaused(false);
    }

    return (
        <div style={{backgroundImage: "url(blurredBackground.png)", backgroundSize: "cover", width: "100vw", height: "100vh"}}>
            <Box className="welcome" sx={{overflowY: "scroll", maxHeight: "90vh"}}>
                <h2 style={{textAlign: "center"}}>Review Your Mistakes</h2>
                
                

                <div style={{textAlign: "center"}}>
                    <button style={{backgroundColor: "#444", padding: "20px", border: "1px solid white"}} onClick={handleResumeClicked}>Resume</button>
                </div>
            </Box>
        </div>
    )
}

export default MistakeTracker