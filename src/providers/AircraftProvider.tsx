import { type ReactNode } from 'react';
import type { Aircraft, FlightPlan, FlightStatus } from '../types/common';
import { AircraftContext } from '../hooks/useAircraft';
import { makeNewFlight } from '../utils/flightPlans';
import { useImmer } from 'use-immer';
import { usePrefRoutes } from '../hooks/usePrefRoutes';
import { useParkingSpots } from '../hooks/useParkingSpots';

export function AircraftProvider({ children }: { children: ReactNode }) {
  const { reserveSpot } = useParkingSpots();
  const prefRoutes = usePrefRoutes();

  const [aircrafts, setAircrafts] = useImmer<Aircraft[]>([]);

  function amendFlightPlan(amendedFlightPlan: FlightPlan) {
    setAircrafts((draft) => {
      const replaceIndex = draft.findIndex(
        (aircraft) => aircraft.callsign === amendedFlightPlan.callsign
      );
      if (replaceIndex !== -1) {
        draft[replaceIndex].flightPlan = amendedFlightPlan;
      }
    });
  }

  function removeFirstRequest(callsign: string) {
    setAircrafts((draft) => {
      const modifyIndex = draft.findIndex((aircraft) => aircraft.callsign === callsign);
      if (modifyIndex !== -1) {
        draft[modifyIndex].requests.splice(0, 1);
      }
    });
  }

  function setNextRequestTime(callsign: string, canSendRequestTime: number, timer: number) {
    setAircrafts((draft) => {
      const modifyIndex = draft.findIndex((aircraft) => aircraft.callsign === callsign);
      if (modifyIndex !== -1) {
        draft[modifyIndex].canSendRequestTime = timer + canSendRequestTime;
      }
    });
  }

  function setPlanePosition(callsign: string, x: number, y: number, angle?: number) {
    setAircrafts((draft) => {
      const modifyIndex = draft.findIndex((aircraft) => aircraft.callsign === callsign);
      if (modifyIndex !== -1) {
        draft[modifyIndex].positionX = x;
        draft[modifyIndex].positionY = y;
        if (angle) {
          draft[modifyIndex].rotation = angle;
        }
      }
    });
  }

  function setTaxiwayNodeId(callsign: string, id: string) {
    setAircrafts((draft) => {
      const modifyIndex = draft.findIndex((aircraft) => aircraft.callsign === callsign);
      if (modifyIndex !== -1) {
        draft[modifyIndex].taxiwayNodeId = id;
      }
    });
  }

  function setPlaneStatus(callsign: string, status: FlightStatus, timer: number) {
    setAircrafts((draft) => {
      const modifyIndex = draft.findIndex((aircraft) => aircraft.callsign === callsign);
      if (modifyIndex !== -1) {
        draft[modifyIndex].status = status;
        draft[modifyIndex].statusChangedTime = timer;
      }
    });
  }

  function deleteFlightPlan(callsign: string) {
    setAircrafts((draft) => {
      const deleteIndex = draft.findIndex((aircraft) => aircraft.callsign === callsign);
      if (deleteIndex !== -1) {
        draft.splice(deleteIndex, 1);
      }
    });
  }

  function spawnNewFlight(): Aircraft | undefined {
    const random = Math.random();
    const flightType = random < 0.5 ? 'airline' : random < 0.7 ? 'TEC' : 'ga';

    const parkingSpot = reserveSpot(flightType);
    if (parkingSpot) {
      const newAircraft = makeNewFlight(parkingSpot, prefRoutes);
      setAircrafts((draft) => {
        draft.push(newAircraft);
      });
      return newAircraft;
    }
  }

  function setAircraftHasBeenSpokenTo(callsign: string) {
    setAircrafts((draft) => {
      const aircraft = draft.find((aircraft) => aircraft.callsign === callsign);
      if (aircraft) {
        aircraft.hasBeenSpokenTo = true;
      }
    });
  }

  function holdPosition(callsign: string, value: boolean, timer: number) {
    setAircrafts((draft) => {
      const aircraft = draft.find((aircraft) => aircraft.callsign === callsign);
      if (aircraft) {
        if (aircraft.status === 'pushback' && aircraft.holdingPosition) {
          aircraft.canSendRequestTime = value ? Number.MAX_SAFE_INTEGER : timer + 90000;
        }
        aircraft.holdingPosition = value;
      }
    });
  }

  const value = {
    aircrafts,
    amendFlightPlan,
    removeFirstRequest,
    setNextRequestTime,
    setPlanePosition,
    setPlaneStatus,
    deleteFlightPlan,
    spawnNewFlight,
    setTaxiwayNodeId,
    setAircraftHasBeenSpokenTo,
    holdPosition,
  };

  return <AircraftContext.Provider value={value}>{children}</AircraftContext.Provider>;
}
