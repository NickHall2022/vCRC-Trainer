import { useEffect, useState, type ReactNode } from "react";
import { SimulationContext } from "../hooks/useSimulation";
import { useMessages } from "../hooks/useMessages";
import { useImmer } from "use-immer";
import type { AircraftRequest, FlightPlan, SimulationDetails, StripData } from "../types/common";
import { useFlightPlans } from "../hooks/useFlightPlans";
import { distance, taxiways } from "../utils/taxiways";
import { useStrips } from "../hooks/useStrips";
import { useParkingSpots } from "../hooks/useParkingSpots";
import { useDifficulty } from "../hooks/useDifficulty";
import { useMistakes } from "../hooks/useMistakes";

import type { Node } from "../utils/taxiways";
import { ATIS } from "../utils/flightPlans";

const endNode = taxiways.find(node => node.id === "END") as Node;
const TAXIWAY_NODE_THRESHOLD = 0.5;
const PLANE_DIST_THRESHOLD = 2.2;

export function SimulationProvider({ children }: { children: ReactNode }){
    const [requests, setRequests] = useImmer<AircraftRequest[]>([]);
    const [paused, setPaused] = useImmer(false);
    const { difficulty } = useDifficulty();
    const { addMistake, reviewClearance, reviewVFRDeparture } = useMistakes();
    const { strips } = useStrips();
    const [timer, setTimer] = useState(0);

    const { flightPlans, removeFirstRequest, setNextRequestTime, setPlanePosition, setTaxiwayNodeId, setPlaneStatus, deleteFlightPlan, spawnNewFlight } = useFlightPlans();
    const { releaseSpot } = useParkingSpots();
    const { printAmendedFlightPlan } = useStrips();
        
    const { sendMessage } = useMessages();

    function addNewRequest(newRequest: AircraftRequest){
        if(newRequest.requestMessage){
            sendMessage(newRequest.requestMessage, newRequest.callsign, "radio");
        }

        const modifiedRequest = {...newRequest};
        if(newRequest.reminder){
            modifiedRequest.reminder = {...newRequest.reminder, sendTime: timer + newRequest.reminder.sendDelay};
        }

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

            setTimer(timer + 1000);

            for(const flightPlan of flightPlans){
                if(flightPlan.status === "pushback"){
                    const angleAsRadians = flightPlan.rotation * Math.PI / 180;
                    const diffX = -Math.cos(angleAsRadians) * Math.min(0.05, Math.abs(flightPlan.positionX - flightPlan.pushbackLocation.x));
                    const diffY = Math.sin(angleAsRadians) * Math.min(0.05, Math.abs(flightPlan.positionY - flightPlan.pushbackLocation.y));
                    setPlanePosition(flightPlan.callsign, flightPlan.positionX + diffX, flightPlan.positionY + diffY);
                } else if(flightPlan.status === "taxi" || flightPlan.status === "departing"){
                    movePlaneTowardsRunway(flightPlan);
                } else if(flightPlan.status === "handedOff"){
                    movePlaneTowardsRunway(flightPlan);
                    if(timer - (flightPlan.statusChangedTime as number) > 20000){
                        const localStrips = strips.filter(strip => strip.bayName === "local");
                        if(!localStrips.find(strip => (strip as StripData).callsign === flightPlan.callsign)){
                            sendMessage(`Can you pass me the strip for ${flightPlan.callsign}?`, "PWM_TWR", "ATC");
                            addMistake("stripHandoff", flightPlan.callsign);
                            setPlaneStatus(flightPlan.callsign, "handedOffReminded", timer);
                        } else {
                            setPlaneStatus(flightPlan.callsign, "departed", timer);
                        }
                        if(flightPlan.routeType === "VFR" || flightPlan.routeType === "VFRFF"){
                            reviewVFRDeparture(flightPlan.callsign);
                        }
                    }
                } else if(flightPlan.status === "handedOffReminded") {
                    movePlaneTowardsRunway(flightPlan);
                    const localStrips = strips.filter(strip => strip.bayName === "local");
                    if(localStrips.find(strip => (strip as StripData).callsign === flightPlan.callsign)){
                        setPlaneStatus(flightPlan.callsign, "departed", timer);
                    }
                } else if(flightPlan.status === "departed"){
                    const localStrips = strips.filter(strip => strip.bayName === "local");
                    const strip = localStrips.find(strip => (strip as StripData).callsign === flightPlan.callsign) as StripData;
                    if(strip && (strip.box10 !== "B" || strip.box12 !== ATIS)) {
                        addMistake("stripBox", flightPlan.callsign);
                    }
                    deleteFlightPlan(flightPlan.callsign);
                }
            }

            const flightsWithRequest = flightPlans.filter(flightPlan => {
                if(flightPlan.requests.length === 0){
                    return;
                }
                if(flightPlan.canSendRequestTime > timer){
                    return;
                }
                return !requests.find(request => request.callsign === flightPlan.callsign);
            });

            if(Math.floor(timer / 1000) % 15 === 0){
                if(flightsWithRequest.length < 1 + difficulty){
                    const newFlight = spawnNewFlight();
                    if (newFlight && (newFlight.routeType === "TEC" || newFlight?.routeType === "H")) {
                        printAmendedFlightPlan(newFlight);
                    }
                }
            }

            if(Math.floor(timer / 1000) % Math.ceil(90 / difficulty) === 0){
                for(const request of requests){
                    if(request.reminder && request.reminder.sendTime && timer >= request.reminder.sendTime){
                        sendMessage(request.reminder.message, request.callsign, "radio");
                        addMistake(request.reminder.type, request.callsign);
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
    }, [flightPlans, requests, setRequests, removeFirstRequest, sendMessage, setPlanePosition, setTaxiwayNodeId, paused, timer]);

    function movePlaneTowardsRunway(flightPlan: FlightPlan){
        const planeX = flightPlan.positionX;
        const planeY = flightPlan.positionY;
        const callsign = flightPlan.callsign;

        const dist = flightPlan.taxiwayNodeId ? movePlaneToSavedNode(flightPlan) : 0;

        if(dist < TAXIWAY_NODE_THRESHOLD){
            let closestNode = taxiways[0];
            let distanceToClosest = 100;
            for(const node of taxiways){
                const distanceToNode = distance(planeX, planeY, node.x, node.y);
                if(distanceToNode < distanceToClosest){
                    const myDistanceToEnd = distance(planeX, planeY, endNode.x, endNode.y);
                    const otherDistanceToEnd = distance(node.x, node.y, endNode.x, endNode.y);
                    if(myDistanceToEnd >= otherDistanceToEnd){
                        distanceToClosest = distanceToNode;
                        closestNode = node;
                    }
                }
            }

            if(distanceToClosest >= TAXIWAY_NODE_THRESHOLD){
                setTaxiwayNodeId(flightPlan.callsign, closestNode.id);
            } else {
                if(closestNode.edges[0]){
                    setTaxiwayNodeId(flightPlan.callsign, closestNode.edges[0].id);
                }
            }
        }

        const distanceToEnd = distance(planeX, planeY, endNode.x, endNode.y)
        if(distanceToEnd < 20){
            const flightPlan = flightPlans.find(flight => flight.callsign === callsign);
            if(flightPlan && flightPlan.status === "taxi"){
                addNewRequest({
                    callsign,
                    priority: 1,
                    responseMessage: "Contact tower 120.9",
                    nextRequestDelay: 0,
                    nextStatus: "handedOff",
                    atcMessage: `${flightPlan.callsign} handed to tower`,
                    reminder: {
                        message: "Ground, should we switch to tower?",
                        type: "aircraftHandoff",
                        sendDelay: 60000
                    }
                });
                setPlaneStatus(callsign, "departing", timer);
            }
        }
}

    function movePlaneToSavedNode(flightPlan: FlightPlan): number {
        let savedNode: Node = taxiways.find(node => node.id === flightPlan.taxiwayNodeId) as Node;
        const planeX = flightPlan.positionX;
        const planeY = flightPlan.positionY;

        const dist = distance(planeX, planeY, savedNode.x, savedNode.y);

        const angleAsRadians = Math.atan2(savedNode.y - planeY, savedNode.x - planeX);
        const diffX = Math.min(Math.cos(angleAsRadians) * 0.35, Math.abs(savedNode.x - planeX));
        const diffY = Math.min(Math.sin(angleAsRadians) * 0.35, Math.abs(savedNode.y - planeY));

        const otherTaxiing = flightPlans.filter(flight => flight.status !== "ramp" && flight.status !== "clearedIFR");
        for(let otherFlight of otherTaxiing){
            const distToFlight = distance(planeX, planeY, otherFlight.positionX, otherFlight.positionY);
            if(distToFlight < PLANE_DIST_THRESHOLD){
                const myDistanceToEnd = distance(planeX, planeY, endNode.x, endNode.y);
                const otherDistanceToEnd = distance(otherFlight.positionX, otherFlight.positionY, endNode.x, endNode.y);
                if(myDistanceToEnd > otherDistanceToEnd){
                    return dist;
                }
            }
        }

        setPlanePosition(flightPlan.callsign, planeX + diffX, planeY + diffY, -angleAsRadians * 180 / Math.PI);

        return dist;
    }

    function completeRequest(callsign: string){
        const completedRequestIndex = requests.findIndex(request => request.callsign === callsign);
        if(completedRequestIndex === -1){
            return;
        }
        const completedRequest = requests[completedRequestIndex];

        if(completedRequest.responseMessage){
            if(completedRequest.atcMessage){
                sendMessage(completedRequest.atcMessage, "PWM_GND", "self")
            }
            sendMessage(completedRequest.responseMessage, completedRequest.callsign, "radio");
        }

        setNextRequestTime(completedRequest.callsign, completedRequest.nextRequestDelay, timer);

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

        if(completedRequest.nextStatus === "handedOff"){
            const flight = flightPlans.find(flight => flight.callsign === callsign);
            if(flight){
                releaseSpot(flight.parkingSpotId);
            }
        } else if(completedRequest.nextStatus === "clearedIFR"){
            reviewClearance(callsign);
        }

        if(completedRequest.nextStatus){
            setPlaneStatus(completedRequest.callsign, completedRequest.nextStatus, timer);
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
