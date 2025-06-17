import { type ReactNode } from "react";
import type { Message, MessagesDetails, MessageType } from "../types/common";
import { MessagesContext } from "../hooks/useMessages";
import { useImmer } from "use-immer";
import useSound from "use-sound";

export function MessagesProvider({ children }: { children: ReactNode }){
    const [playRadioMessageSound] = useSound("/RadioMessage.wav");

    const [messages, setMessages] = useImmer<Message[]>([
        { content: "Network simulation activated", type: "system", time: Date.now(), callsign: "" },
        { content: "Weather is VFR, ATIS information A, landing and departing runway 29. Runway 36 is inactive. We have departure and center online above. I haven't talked to any planes on the ground yet. Coordination is contact with strips, your control, HL.", type: "ATC", time: Date.now(), callsign: "PWM_TWR" }
    ]);

    function sendMessage(content: string, callsign: string, type: MessageType){
        playRadioMessageSound();
        setMessages((draft) => {
            draft.push({
                content,
                callsign,
                type,
                time: Date.now()
            })
        });
    }

    const value: MessagesDetails = {
        messages,
        sendMessage
    }

    return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}
