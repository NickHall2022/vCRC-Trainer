import Grid from "@mui/material/Grid";
import { CabViewWindow } from "../components/CabViewWindow";
import { StripsWindow } from "../components/StripsWindow";
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