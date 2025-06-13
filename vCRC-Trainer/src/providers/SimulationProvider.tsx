import { useEffect, type ReactNode } from "react";
import { SimulationContext } from "../hooks/useSimulation";
import { useMessages } from "../hooks/useMessages";
import { useImmer } from "use-immer";
import type { AircraftRequest, SimulationDetails } from "../types/common";
import { useFlightPlans } from "../hooks/useFlightPlans";

export function SimulationProvider({ children }: { children: ReactNode }){
    const [requests, setRequests] = useImmer<AircraftRequest[]>([]);

    const { flightPlans, removeFirstRequest, setNextRequestTime, setPlanePosition, setPlaneStatus } = useFlightPlans();
    const { sendMessage } = useMessages();

    function addNewRequest(newRequest: AircraftRequest){
        if(newRequest.requestMessage){
            sendMessage(newRequest.requestMessage, newRequest.callsign, "radio");
        }

        const modifiedRequest = {...newRequest};
        if(newRequest.reminder){
            modifiedRequest.reminder = {...newRequest.reminder, sendTime: Date.now() + newRequest.reminder.sendDelay};
        }

        setNextRequestTime(newRequest.callsign, newRequest.nextRequestDelay);

        setRequests((draft) => {
            const previousRequestIndex = requests.findIndex(request => request.callsign === modifiedRequest.callsign);
            if(previousRequestIndex !== -1){
                draft.splice(previousRequestIndex, 1);
            }
            
            draft.push(modifiedRequest);
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            for(const request of requests){
                if(request.reminder && request.reminder.sendTime && Date.now() >= request.reminder.sendTime){
                    sendMessage(request.reminder.message, request.callsign, "radio");
                    setRequests((draft) => {
                        const modifiedRequest = draft.find(element => element.callsign === request.callsign);
                        if(modifiedRequest){
                            delete modifiedRequest.reminder;
                        }
                    });
                    return;
                }
            }
            
            if(requests.length >= 3){
                return;
            }

            const flightsWithRequest = flightPlans.filter(flightPlan => {
                if(flightPlan.requests.length === 0){
                    return;
                }
                if(flightPlan.canSendRequestTime > Date.now()){
                    return;
                }
                return !requests.find(request => request.callsign === flightPlan.callsign);
            });

            if(flightsWithRequest.length === 0){
                return;
            }

            const chosenFlight = flightsWithRequest[0];
            const request = chosenFlight.requests[0];

            addNewRequest(request);
            removeFirstRequest(chosenFlight.callsign);
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [flightPlans, requests, setRequests, removeFirstRequest, sendMessage]);

    useEffect(() => {
        const interval = setInterval(() => {
            for(const flightPlan of flightPlans){
                if(flightPlan.status === "pushback"){
                    const angleAsRadians = flightPlan.rotation * Math.PI / 180;
                    const diffX = -Math.cos(angleAsRadians) * Math.min(0.1, Math.abs(flightPlan.positionX - flightPlan.pushbackLocation.x));
                    const diffY = Math.sin(angleAsRadians) * Math.min(0.1, Math.abs(flightPlan.positionY - flightPlan.pushbackLocation.y));
                    setPlanePosition(flightPlan.callsign, flightPlan.positionX + diffX, flightPlan.positionY + diffY);
                }
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [flightPlans, setPlanePosition]);

    function completeRequest(callsign: string){
        const completedRequestIndex = requests.findIndex(request => request.callsign === callsign);
        if(completedRequestIndex === -1){
            return;
        }
        const completedRequest = requests[completedRequestIndex];

        if(completedRequest.responseMessage){
            sendMessage(completedRequest.responseMessage, completedRequest.callsign, "radio");
        }

        if(completedRequest.subsequentRequest){
            addNewRequest(completedRequest.subsequentRequest);
        } else {
            setRequests((draft) => {
            draft.splice(completedRequestIndex, 1);
                if(completedRequest.subsequentRequest){
                    draft.push(completedRequest.subsequentRequest);
                }
            });
        }

        if(completedRequest.nextStatus){
            setPlaneStatus(completedRequest.callsign, completedRequest.nextStatus);
        }
    }

    const value: SimulationDetails = {
        completeRequest
    }

    return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}
