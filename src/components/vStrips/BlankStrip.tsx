
import type { StripData } from "../../types/common";
import { useStrips } from "../../hooks/useStrips";
import type { WritableDraft } from "immer";
import { ControlledInput } from "../../utils/ControlledInput";

type Props = {
    stripData: StripData,
}

export function BlankStrip({ stripData }: Props){

    const { setStrips } = useStrips();

    function handleTextInput(fieldType: keyof Pick<StripData, "callsign" | "aircraftType" | "altitude" | "departure" | "route" | "remarks" | "box10" | "box12">, value: string){
        setStrips((draft) => {
            const editingStrip = draft.find(strip => strip.id === stripData.id) as WritableDraft<StripData>;
            if(editingStrip){
                editingStrip[fieldType] = value.toUpperCase();
            }
        });
    }

    return (
        <div>
            <div style={{position: "absolute", left: "5px", top: "5px"}}>
                <ControlledInput className={"stripTextInputSmall"} disabled={stripData.bayName === "printer"} maxLength={8} value={stripData.callsign} onChange={(event) => handleTextInput("callsign", event.target.value)}></ControlledInput>
                <br></br>
                <ControlledInput className={"stripTextInputSmall"} disabled={stripData.bayName === "printer"} maxLength={8} value={stripData.aircraftType} onChange={(event) => handleTextInput("aircraftType", event.target.value)}></ControlledInput>
            </div>
            <div style={{position: "absolute", left: "125px"}}>
                <br></br>
                <br></br>
                <ControlledInput className={"stripTextInputSmall"} disabled={stripData.bayName === "printer"} maxLength={7} value={stripData.altitude} onChange={(event) => handleTextInput("altitude", event.target.value)}></ControlledInput>
            </div>
            <div style={{position: "absolute", left: "173px", top: "5px"}}>
                <ControlledInput className={"stripTextInputSmall"} disabled={stripData.bayName === "printer"} maxLength={4} value={stripData.departure} onChange={(event) => handleTextInput("departure", event.target.value)}></ControlledInput>
            </div>
            <div style={{position: "absolute", left: "248px", top: "5px"}}>
                <ControlledInput className={"stripTextInputSmall"} disabled={stripData.bayName === "printer"} maxLength={15} value={stripData.route} onChange={(event) => handleTextInput("route", event.target.value)}></ControlledInput>
                <br></br>
                <ControlledInput className={"stripTextInputSmall"} disabled={stripData.bayName === "printer"} maxLength={15} value={stripData.remarks} onChange={(event) => handleTextInput("remarks", event.target.value)}></ControlledInput>
            </div>
            <input type="text" className={"stripTextInput"} disabled={stripData.bayName === "printer"} maxLength={1} value={stripData.box10} size={1} onChange={(event) => handleTextInput("box10", event.target.value)} style={{position: "absolute", left: "452px", outline: "none"}}></input>
            <input type="text" className={"stripTextInput"} disabled={stripData.bayName === "printer"} maxLength={1} value={stripData.box12} size={1} onChange={(event) => handleTextInput("box12", event.target.value)} style={{position: "absolute", left: "515px", outline: "none"}}></input>
        </div>
    )
}
