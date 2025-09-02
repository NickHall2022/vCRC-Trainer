import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useStrips } from "../../hooks/useStrips";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { AbstractStrip, DividerData } from "../../types/common";
import { BayItem } from "./BayItem";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { v4 as uuidv4 } from 'uuid';

type Props = {
    handleDrop: () => void,
    setDraggedStrip: Dispatch<SetStateAction<AbstractStrip>>,
    handleStripInsert: (targetStrip: AbstractStrip) => void
}

export function StripsBay({handleDrop, setDraggedStrip, handleStripInsert} : Props){

    const { strips, selectedBay, setStrips } = useStrips();
    const [contextMenu, setContextMenu] = useState<{
            mouseX: number;
            mouseY: number;
        } | null>(null);

    function handleDragOver(event: React.DragEvent){
        event.preventDefault();
    }

    function handleContextMenu(event: React.MouseEvent) {
        event.preventDefault();

        setContextMenu(
            contextMenu === null ? {
                mouseX: event.clientX + 2,
                mouseY: event.clientY - 6,
            } : null,
        );
    };

    function handleAddSeparator(){
        handleClose();
        setStrips((draft) => {
            draft.push({
                id: uuidv4(),
                name: "",
                type: "handwrittenDivider",
                offset: false,
                bayName: selectedBay,
            } as DividerData)
        });
    }

    function handleClose() {
        setContextMenu(null);
    };

    

    function createStrips(){
        return [...strips].reverse().filter(strip => strip.bayName === selectedBay).map(strip => {
            return (
                <ListItem key={strip.id} sx={{padding: "0px"}}>
                    <BayItem abstractStripData={strip} setDraggedStrip={setDraggedStrip} handleStripInsert={handleStripInsert}></BayItem>
                </ListItem>
            );
        });
    }
    
    return (
        <>
            <img src="/vSweatbox/stripBay.png" draggable={false} style={{width: "550px", height: "100vh", position: "absolute", left: "0px", top: "0px"}} onDrop={handleDrop} onDragOver={handleDragOver} onContextMenu={handleContextMenu}></img>
            <Menu 
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
                <MenuItem onClick={handleAddSeparator}>
                    Add separator
                </MenuItem>
            </Menu>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 'calc(100vh - 55px)'}}>
                <List sx={{padding: "0px", maxHeight: 'calc(100vh - 55px)', overflowY: "scroll", width: "570px",  position: "fixed", 
                    '&::-webkit-scrollbar': {
                    display: 'none',
                    },
                    'msOverflowStyle': 'none',
                    'scrollbarWidth': 'none'}}
                >
                    {createStrips()}
                </List>
            </Box>
        </>
    )
}