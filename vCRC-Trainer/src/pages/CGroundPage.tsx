import Grid from "@mui/material/Grid";
import { CabViewWindow } from "../components/CabViewWindow";
export function CGgroundPage() {
    return (
        <Grid container >
            <Grid size={3}>
                {/* <CabViewWindow></CabViewWindow> */}
            </Grid>
            <Grid size={9}>
                <CabViewWindow></CabViewWindow>
            </Grid>
        </Grid>
    )
}