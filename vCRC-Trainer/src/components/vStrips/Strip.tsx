import { useState } from "react";
import type { BayName, StripData } from "../../types/common";
import { useStrips } from "../../hooks/useStrips";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { PrintedStrip } from "./PrintedStrip";
import { BlankStrip } from "./BlankStrip";

type Props = {
    stripData: StripData
}

type Coordinates = {
    mouseX: number;
    mouseY: number;
} | null;

export function Strip({stripData}: Props){
    const { setStrips, deleteStrip, moveStripToBay, selectedBay } = useStrips();

    const [contextMenu, setContextMenu] = useState<Coordinates>(null);
    const [pushContextMenu, setPushContextMenu] = useState<Coordinates>(null);

    function handleContextMenu(event: React.MouseEvent) {
        event.preventDefault();

        setContextMenu(
            contextMenu === null ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null,
        );
        setPushContextMenu(null);
    };

    function handlePushContextMenu(event: React.MouseEvent) {
        event.preventDefault();

        setPushContextMenu(
            pushContextMenu === null ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null,
        );
    }

    const handleClose = () => {
        setContextMenu(null);
        setPushContextMenu(null);
    };

    function handleDelete() {
        handleClose();
        deleteStrip(stripData.id);
    }

    function handleOffset() {
        handleClose();
        setStrips((draft) => {
            const updateIndex = draft.findIndex(strip => strip.id === stripData.id);
            draft[updateIndex].offset = !draft[updateIndex].offset;
        });
    }

    function handlePushToBay(bayName: BayName){
        moveStripToBay(stripData, bayName);
    }

    const style: React.CSSProperties = {
        backgroundImage: "url(/strip.png)",
        color: "black",
        width: "550px",
        height: "76px",
        position: "relative",
        fontSize: "14px",
        lineHeight: "25px",
        left: stripData.bayName !== "printer" && stripData.offset ? "20px" : "0px"
    }

    function getStripComponent(){
        if(stripData.type === "strip"){
            return (
                <PrintedStrip stripData={stripData}></PrintedStrip>
            )
        }
        if(stripData.type === "blank"){
            return (
                <BlankStrip stripData={stripData}></BlankStrip>
            )
        }
    }

    return (
        <div style={style} draggable={true} onContextMenu={handleContextMenu}>
            {getStripComponent()}

            {stripData.bayName !== "printer" && <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
                transitionDuration={0}
            >
                <MenuItem onClick={handlePushContextMenu}>
                    Push...
                    <Menu 
                        open={contextMenu !== null && pushContextMenu !== null}
                        onClose={handleClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            pushContextMenu !== null
                                ? { top: pushContextMenu.mouseY, left: pushContextMenu.mouseX }
                                : undefined
                        }
                        transitionDuration={0}
                    >
                        {selectedBay !== "ground" && <MenuItem onClick={() => handlePushToBay("ground")}>GC</MenuItem>}
                        {selectedBay !== "local" && <MenuItem onClick={() => handlePushToBay("local")}>LC</MenuItem>}
                        {selectedBay !== "spare" && <MenuItem onClick={() => handlePushToBay("spare")}>SPARE</MenuItem>}
                    </Menu>
                </MenuItem>
                <MenuItem onClick={handleOffset}>Offset</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>}
        </div>
    )
}
