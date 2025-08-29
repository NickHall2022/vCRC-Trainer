import { useEffect, type ReactNode } from "react";
import { SimulationContext } from "../hooks/useSimulation";
import { useMessages } from "../hooks/useMessages";
import { useImmer } from "use-immer";
import type { AircraftRequest, SimulationDetails } from "../types/common";
import { useFlightPlans } from "../hooks/useFlightPlans";
import { distance, taxiways } from "../utils/taxiways";
import { useStrips } from "../hooks/useStrips";
import { useParkingSpots } from "../hooks/useParkingSpots";
import { useDifficulty } from "../hooks/useDifficulty";

export function SimulationProvider({ children }: { children: ReactNode }){
    const [requests, setRequests] = useImmer<AircraftRequest[]>([]);
    const [paused, setPaused] = useImmer(false);
    const { difficulty } = useDifficulty();

    const { flightPlans, removeFirstRequest, setNextRequestTime, setPlanePosition, setPlaneStatus, deleteFlightPlan, spawnNewFlight } = useFlightPlans();
    const { releaseSpot } = useParkingSpots();
    const { printAmendedFlightPlan } = useStrips();
        
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
            if(paused){
                return;
            }

            for(const flightPlan of flightPlans){
                if(flightPlan.status === "pushback"){
                    const angleAsRadians = flightPlan.rotation * Math.PI / 180;
                    const diffX = -Math.cos(angleAsRadians) * Math.min(0.05, Math.abs(flightPlan.positionX - flightPlan.pushbackLocation.x));
                    const diffY = Math.sin(angleAsRadians) * Math.min(0.05, Math.abs(flightPlan.positionY - flightPlan.pushbackLocation.y));
                    setPlanePosition(flightPlan.callsign, flightPlan.positionX + diffX, flightPlan.positionY + diffY);
                } else if(flightPlan.status === "taxi" || flightPlan.status === "departing"){
                    movePlaneTowardsRunway(flightPlan.callsign, flightPlan.positionX, flightPlan.positionY);
                } else if(flightPlan.status === "departed"){
                    deleteFlightPlan(flightPlan.callsign);
                }
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

            if(flightsWithRequest.length < 2 + difficulty + 100){
                const newFlight = spawnNewFlight();
                if (newFlight) {
                    printAmendedFlightPlan(newFlight);
                }
            }

            if(Math.floor(Date.now() / 1000) % Math.ceil(60 / difficulty) === 0){
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
                
                if(requests.length >= difficulty){
                    return;
                }
    
                if(flightsWithRequest.length === 0){
                    return;
                }
    
                let maxPriority = -1;
                for(const flightPlan of flightsWithRequest){
                    if(flightPlan.requests[0].priority > maxPriority){
                        maxPriority = flightPlan.requests[0].priority;
                    }
                }
                const priorityFlightPlansWithRequest = flightsWithRequest.filter(flightPlan => flightPlan.requests[0].priority === maxPriority);
                const randomIndex = Math.floor(Math.random() * priorityFlightPlansWithRequest.length);
                const chosenFlight = priorityFlightPlansWithRequest[randomIndex];
                const request = chosenFlight.requests[0];
    
                addNewRequest(request);
                removeFirstRequest(chosenFlight.callsign);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [flightPlans, requests, setRequests, removeFirstRequest, sendMessage, setPlanePosition, paused]);

    function movePlaneTowardsRunway(callsign: string, planeX: number, planeY: number){
        let closestNode = taxiways[0];
        let distanceToClosest = 100;
        for(const node of taxiways){
            const dist = distance(planeX, planeY, node.x, node.y);
            if(dist < distanceToClosest){
                distanceToClosest = dist;
                closestNode = node;
            }
        }

        if(closestNode.edges.length > 0){
            const distanceBetweenClosestAndNext = distance(closestNode.edges[0].x, closestNode.edges[0].y, closestNode.x, closestNode.y);
            const distanceBetweenPlaneAndNext = distance(closestNode.edges[0].x, closestNode.edges[0].y, planeX, planeY);
            if(distanceBetweenPlaneAndNext <= distanceToClosest + distanceBetweenClosestAndNext){
                closestNode = closestNode.edges[0];
            }
        }

        const angleAsRadians = Math.atan2(closestNode.y - planeY, closestNode.x - planeX);
        const diffX = Math.min(Math.cos(angleAsRadians) * 0.35, Math.abs(closestNode.x - planeX));
        const diffY = Math.min(Math.sin(angleAsRadians) * 0.35, Math.abs(closestNode.y - planeY));
        setPlanePosition(callsign, planeX + diffX, planeY + diffY, -angleAsRadians * 180 / Math.PI);

        const endNode = taxiways.find(node => node.id === "END");
        if(endNode){
            const dist = distance(planeX, planeY, endNode.x, endNode.y)
            if(dist < 15){
                const flightPlan = flightPlans.find(flight => flight.callsign === callsign);
                if(flightPlan && flightPlan.status === "taxi"){
                    addNewRequest({
                        callsign,
                        priority: 1,
                        responseMessage: "Contact tower 120.9",
                        nextRequestDelay: 0,
                        nextStatus: "departed"
                    });
                    setPlaneStatus(callsign, "departing");
                }
            }
        }
    }

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

        if(completedRequest.nextStatus === "taxi"){
            const flight = flightPlans.find(flight => flight.callsign === callsign);
            if(flight){
                releaseSpot(flight.parkingSpotId);
            }
        }

        if(completedRequest.nextStatus){
            setPlaneStatus(completedRequest.callsign, completedRequest.nextStatus);
        }
    }

    const value: SimulationDetails = {
        completeRequest,
        setPaused
    }

    return (
        <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
    );
}
