import type { StripData } from "../types/common";

const DIVIDER_STRIPS = ["clearance", "taxi", "pushback", "holdCross", "runway"];

export function isStripDividerStrip(strip: StripData){
    return DIVIDER_STRIPS.indexOf(strip.callsign) !== -1;
}
