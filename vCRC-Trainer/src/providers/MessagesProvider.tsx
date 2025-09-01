import { type ReactNode } from "react";
import type { Message, MessagesDetails, MessageType } from "../types/common";
import { MessagesContext } from "../hooks/useMessages";
import { useImmer } from "use-immer";
import useSound from "use-sound";
import { ATIS } from "../utils/flightPlans";

export function MessagesProvider({ children }: { children: ReactNode }){
    const [playRadioMessageSound] = useSound("/RadioMessage.wav");

    const [messages, setMessages] = useImmer<Message[]>([
        { content: "Network simulation activated", type: "system", time: Date.now(), callsign: "" },
        { content: `Airport: Portland airport ATIS ${ATIS}, Runway 29 in use. Runway 36 is inactive and your control. You have me on Local, CASCO on above as departure, and Center online above that. Airspace: not applicable. Special activities: none. Enroute weather: VFR, calm winds, no significant trends. Traffic: Nobody is moving on the ground, no clearances have been issued.`, type: "ATC", time: Date.now(), callsign: "PWM_TWR" }
    ]);

    function sendMessage(content: string, callsign: string, type: MessageType){
        function addMessage(){
            setMessages((draft) => {
                draft.push({
                    content,
                    callsign,
                    type,
                    time: Date.now()
                })
            });
        }
        if(type !== "self"){
            setTimeout(() => {
                playRadioMessageSound();
                addMessage();
            }, 750);
        } else {
            addMessage();
        }
    }

    const value: MessagesDetails = {
        messages,
        sendMessage
    }

    return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}
