import type { StripData } from "../../types/common";
import { useStrips } from "../../hooks/useStrips";
import type { WritableDraft } from "immer";

type Props = {
    stripData: StripData
}

export function PrintedStrip({ stripData }: Props){

    const { setStrips } = useStrips();

    function handleTextInput(fieldType: keyof Pick<StripData, "box10" | "box12">, value: string){
        setStrips((draft) => {
            const editingStrip = draft.find(strip => strip.id === stripData.id) as WritableDraft<StripData>;
            if(editingStrip){
                editingStrip[fieldType] = value.toUpperCase();
            }
        });
    }

    const routeLines = splitIntoThreeParts(stripData);

    return (
        <div style={{fontFamily: "monospace"}}>
            <div style={{position: "absolute", left: "5px"}}>
                {stripData.callsign}
                <br></br>
                {stripData.aircraftType}/{stripData.equipmentCode}
                <br></br>
                {stripData.CID}
            </div>
            <div style={{position: "absolute", left: "127px"}}>
                {stripData.squawk}
                <br></br>
                P2100
                <br></br>
                {stripData.altitude}
            </div>
            <div style={{position: "absolute", left: "173px"}}>
                {stripData.departure}
            </div>
            <div style={{position: "absolute", left: "248px"}}>
                {routeLines[0]}
                <br></br>
                {routeLines[1]}
                <br></br>
                {routeLines[2]}
            </div>
            <input type="text" className={"stripTextInput"} disabled={stripData.bayName === "printer"} maxLength={1} value={stripData.box10} size={1} onChange={(event) => handleTextInput("box10", event.target.value)} style={{position: "absolute", left: "452px"}}></input>
            <input type="text" className={"stripTextInput"} disabled={stripData.bayName === "printer"} maxLength={1} value={stripData.box12} size={1} onChange={(event) => handleTextInput("box12", event.target.value)} style={{position: "absolute", left: "515px"}}></input>
            {stripData.printCount > 1 && <div style={{position: "absolute", left: "5px", top: "15px", fontSize: "11px"}}>{stripData.printCount}</div>}
        </div>
    )
}

function splitIntoThreeParts(stripData: StripData) {
    let maxLength = 26;
    const words = stripData.route.split(' ');
    const lines = ['', '', ''];
    let lineIndex = 0;

    for (const word of words) {
        if (word.length > maxLength) {
            continue;
        }

        if ((lines[lineIndex] + word).length + (lines[lineIndex] ? 1 : 0) > maxLength) {
            if(lineIndex === 1){
                maxLength = 19;
            }
            lineIndex++;
            
            if (lineIndex > 2) {
                lines[2] += "***" + stripData.destination;
                return lines;
            }
        }

        lines[lineIndex] += (lines[lineIndex] ? ' ' : '') + word;
    }

    return lines;
}
