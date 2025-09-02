
import { useEffect, useRef, type RefObject } from "react";
import Draggable from "react-draggable";
import { useMessages } from "../../hooks/useMessages";
import List from "@mui/material/List";
import { ListItem } from "@mui/material";
import type { MessageType } from "../../types/common";
import { useSimulation } from "../../hooks/useSimulation";
import { Resizable } from "re-resizable";

export function MessageWindow(){
    const draggableRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLLIElement>(null);

    const { completeRequest } = useSimulation();
    const { messages } = useMessages();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    function handleMessageClicked(callsign: string){
        completeRequest(callsign);
    }

    function handleColor(messageType: MessageType){
        if(messageType === "ATC"){
            return "rgb(0, 230, 0)";
        } else if(messageType === "system"){
            return "yellow"
        } else if(messageType === "self"){
            return "rgb(37, 212, 224)";
        }
        return "white";
    }

    function createMessageDisplay(){
        const messageElements = messages.map(message => {
            const date = new Date(message.time)
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
            const cursor = message.type === "radio" ? "pointer" : "auto";

            const displayString = `[${hours}:${minutes}:${seconds}] ${message.type === "ATC" ? "[ATC] " : ""}${message.callsign ? message.callsign + ": " : ""}${message.content}`;
            
            return (
                <ListItem sx={{padding: "0px"}} key={message.time + message.callsign}>
                    <p style={{color: handleColor(message.type), marginTop: "0px", marginBottom: "0px", fontFamily: "monospace", cursor: cursor}} onClick={() => handleMessageClicked(message.callsign)}>{displayString}</p>
                </ListItem>
            )
        });
        return messageElements;
    }
    
    return (
        <Draggable nodeRef={draggableRef as RefObject<HTMLDivElement>} allowAnyClick={true} handle=".handle">
            <div ref={draggableRef} style={{position: "fixed", bottom: "1%", left: "580px"}}>
                <Resizable defaultSize={{width: 800, height: 300}} minWidth={400} minHeight={100} style={{backgroundColor: "#090909"}}>
                    <div style={{backgroundColor: "#090909", width: "100%", height: "100%", zIndex: 3}}>
                        <div className="handle" style={{backgroundColor: "#151515", margin: "0px", marginBottom: "2px", height: "17px"}}>
                            <p style={{margin: "0px", marginLeft: "4px", fontSize: "11px"}}>Messages - Connected as PWM_GND - Session is ACTIVE</p>
                        </div>
                        <div style={{lineHeight: "16px", fontSize: "15px", paddingLeft: "5px", paddingRight: "5px", paddingBottom: "5px", height: "calc(100% - 19px)"}}>
                            <List sx={{overflowY: "scroll", maxHeight: "calc(100% - 5px)", width: "100%", height: "calc(100% - 5px)", padding: "0px"}}>
                                {createMessageDisplay()}
                                <li ref={scrollRef}></li>
                            </List>
                        </div>
                    </div>
                </Resizable>
            </div>
        </Draggable>
    )
}
  