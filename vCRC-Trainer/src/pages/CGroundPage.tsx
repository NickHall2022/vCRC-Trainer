import Grid from "@mui/material/Grid";
import { CabViewWindow } from "../components/CRC/CabViewWindow";
import { StripsWindow } from "../components/vStrips/StripsWindow";
export function CGgroundPage() {
    return (
        <Grid container >
            <Grid size={"auto"}>
                <StripsWindow></StripsWindow>
            </Grid>
            <Grid size={"grow"}>
                <CabViewWindow></CabViewWindow>
            </Grid>
        </Grid>
    )
}