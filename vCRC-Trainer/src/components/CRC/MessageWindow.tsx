
import { useEffect, useRef, type RefObject } from "react";
import Draggable from "react-draggable";
import { useMessages } from "../../hooks/useMessages";
import List from "@mui/material/List";
import { ListItem } from "@mui/material";
import type { MessageType } from "../../types/common";

export function MessageWindow(){
    const draggableRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLLIElement>(null);

    const { messages } = useMessages();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    function handleColor(messageType: MessageType){
        if(messageType === "ATC"){
            return "rgb(0, 230, 0)";
        } else if(messageType === "system"){
            return "yellow"
        }
        return "white";
    }

    function createMessageDisplay(){
        const messageElements = messages.map(message => {
            const displayString = `[${new Date(message.time).toLocaleTimeString("eo", {hour12: false})}] ${message.callsign ? message.callsign + ": " : ""}${message.content}`;
            
            return (
                <ListItem sx={{padding: "0px"}} key={message.time + message.callsign}>
                    <p style={{color: handleColor(message.type), marginTop: "0px", marginBottom: "0px", fontFamily: "monospace"}}>{displayString}</p>
                </ListItem>
            )
        });
        return messageElements;
    }
    
    return (
        <Draggable nodeRef={draggableRef as RefObject<HTMLElement>} allowAnyClick={true} handle=".handle">
            <div ref={draggableRef} style={{width: "600px", height: "200px", backgroundColor: "#090909", position: "absolute", top: "77%", left: "900px", zIndex: 3}}>
                <div className="handle" style={{backgroundColor: "#151515", margin: "0px", marginBottom: "2px"}}>
                    <p style={{margin: "0px", marginLeft: "4px", fontSize: "11px"}}>Messages</p>
                </div>
                <div style={{lineHeight: "16px", fontSize: "15px"}}>
                    <List sx={{padding: "0px", paddingLeft: "5px", paddingRight: "5px", maxHeight: '180px', overflowY: "scroll", width: "590px",  position: "fixed" }}>
                        {createMessageDisplay()}
                        <li ref={scrollRef}></li>
                    </List>
                </div>
                
            </div>
        </Draggable>
    )
}
  