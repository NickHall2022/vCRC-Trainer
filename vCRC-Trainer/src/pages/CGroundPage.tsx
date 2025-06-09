import Grid from "@mui/material/Grid";
import { CabViewWindow } from "../components/CabViewWindow";
import { StripsWindow } from "../components/StripsWindow";
export function CGgroundPage() {
    return (
        <Grid container >
            <Grid size={3}>
                <StripsWindow></StripsWindow>
            </Grid>
            <Grid size={9}>
                <CabViewWindow></CabViewWindow>
            </Grid>
        </Grid>
    )
}