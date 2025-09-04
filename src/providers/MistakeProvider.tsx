import { type ReactNode } from 'react';
import { useImmer } from 'use-immer';
import type {
  FlightPlan,
  Mistake,
  MistakeDetails,
  MistakeType,
} from '../types/common';
import { MistakeContext } from '../hooks/useMistakes';
import { useAircraft } from '../hooks/useAircraft';
import { DEST_TO_DIRECTION_MAP } from '../utils/constants/routes';
import { usePrefRoutes } from '../hooks/usePrefRoutes';
import { JET_TYPES, TEC_TYPES } from '../utils/constants/aircraftTypes';
import {
  HIGH_WEST_ALT,
  TEC_WEST_ALT,
  HIGH_EAST_ALT,
  TEC_EAST_ALT,
} from '../utils/constants/altitudes';

export function MistakeProvider({ children }: { children: ReactNode }) {
  const [mistakes, setMistakes] = useImmer<Mistake[]>([]);
  const { aircrafts } = useAircraft();
  const prefRoutes = usePrefRoutes();
  const [newMistakes, setNewMistakes] = useImmer<MistakeType[]>([]);

  function addMistake(
    type: MistakeType,
    details?: string,
    secondaryDetails?: string
  ) {
    setMistakes((draft) => {
      draft.push({
        type,
        details,
        secondaryDetails,
      });
    });
    setNewMistakes((draft) => [...draft, type]);
  }

  function reviewClearance(callsign: string) {
    const aircraft = aircrafts.find(
      (aircraft) => aircraft.callsign === callsign
    );
    if (!aircraft) {
      return;
    }
    validateAltitude(aircraft.flightPlan);
    validateEquipment(aircraft.flightPlan, aircraft.actualAircraftType);
    validateRoute(aircraft.flightPlan);
  }

  function validateAltitude(flightPlan: FlightPlan) {
    const regex = /\d{3}/;
    if (
      !regex.test(flightPlan.altitude) ||
      flightPlan.altitude.length !== 3 ||
      Number(flightPlan.altitude) % 10 !== 0
    ) {
      return addMistake('IFRAltFormat', flightPlan.altitude);
    }

    const direction = DEST_TO_DIRECTION_MAP[flightPlan.destination];

    if (direction) {
      if (direction === 'west') {
        if (
          flightPlan.routeType === 'H' &&
          HIGH_WEST_ALT.indexOf(flightPlan.altitude) === -1
        ) {
          return addMistake(
            'badIFRAlt',
            flightPlan.altitude,
            flightPlan.destination
          );
        }
        if (
          flightPlan.routeType === 'TEC' &&
          TEC_WEST_ALT.indexOf(flightPlan.altitude) === -1
        ) {
          return addMistake(
            'badIFRAlt',
            flightPlan.altitude,
            `${flightPlan.destination}(TEC Route)`
          );
        }
        return;
      }
      if (
        flightPlan.routeType === 'H' &&
        HIGH_EAST_ALT.indexOf(flightPlan.altitude) === -1
      ) {
        return addMistake(
          'badIFRAlt',
          flightPlan.altitude,
          flightPlan.destination
        );
      }
      if (
        flightPlan.routeType === 'TEC' &&
        TEC_EAST_ALT.indexOf(flightPlan.altitude) === -1
      ) {
        return addMistake(
          'badIFRAlt',
          flightPlan.altitude,
          `${flightPlan.destination}(TEC Route)`
        );
      }
    }
  }

  function validateEquipment(
    flightPlan: FlightPlan,
    actualAircraftType: string
  ) {
    if (
      JET_TYPES.indexOf(actualAircraftType) > -1 &&
      flightPlan.equipmentCode !== 'L'
    ) {
      addMistake('badEquipment', flightPlan.equipmentCode, actualAircraftType);
    }
    if (
      TEC_TYPES.indexOf(actualAircraftType) > -1 &&
      ['X', 'W', 'P', 'A', 'D', 'B', 'T', 'U'].indexOf(
        flightPlan.equipmentCode
      ) !== -1
    ) {
      addMistake('badEquipment', flightPlan.equipmentCode, actualAircraftType);
    }
  }

  function validateRoute(flightPlan: FlightPlan) {
    const routesToDestination = prefRoutes.highRoutes
      .concat(prefRoutes.tecRoutes)
      .filter((route) => `K${route.destination}` === flightPlan.destination);

    if (routesToDestination.length === 0) {
      return;
    }

    if (
      !routesToDestination.find(
        (route) =>
          route.route.substring(4, route.route.length - 4) ===
          flightPlan.route.trimEnd().trimStart()
      )
    ) {
      addMistake('badRoute', flightPlan.route, flightPlan.destination);
    }
  }

  function reviewVFRDeparture(callsign: string) {
    const aircraft = aircrafts.find(
      (aircraft) => aircraft.callsign === callsign
    );
    if (!aircraft) {
      return;
    }
    reviewVFRAircraftType(aircraft.flightPlan, aircraft.actualAircraftType);
    reviewVFRAltitude(aircraft.flightPlan);
    reviewVFRRemarks(aircraft.flightPlan);
  }

  function reviewVFRAircraftType(
    flightPlan: FlightPlan,
    actualAircraftType: string
  ) {
    if (flightPlan.aircraftType !== actualAircraftType) {
      addMistake(
        'badVFRAircraft',
        flightPlan.aircraftType,
        `${flightPlan.callsign}(${actualAircraftType})`
      );
    }
  }

  function reviewVFRAltitude(flightPlan: FlightPlan) {
    const regex = /VFR\/\d{3}/;
    if (
      !regex.test(flightPlan.altitude) ||
      flightPlan.altitude.length !== 7 ||
      flightPlan.altitude.charAt(flightPlan.altitude.length - 1) !== '5'
    ) {
      return addMistake('VFRAltFormat', flightPlan.altitude);
    }

    if (!flightPlan.requestedAltitude) {
      return;
    }

    let requestedAltitude = `${Number(flightPlan.requestedAltitude) / 100}`;
    if (requestedAltitude.length === 2) {
      requestedAltitude = `0${requestedAltitude}`;
    }
    requestedAltitude = `VFR/${requestedAltitude}`;
    if (requestedAltitude !== flightPlan.altitude) {
      return addMistake(
        'badVFRAlt',
        flightPlan.altitude,
        `${flightPlan.callsign}(requested ${flightPlan.requestedAltitude})`
      );
    }
  }

  function reviewVFRRemarks(flightPlan: FlightPlan) {
    if (
      (flightPlan.routeType === 'VFRFF' &&
        !flightPlan.remarks.toUpperCase().includes('FF')) ||
      (flightPlan.routeType === 'VFR' && flightPlan.remarks.includes('FF'))
    ) {
      addMistake('badVFRFF', flightPlan.remarks, flightPlan.callsign);
    }
  }

  const value: MistakeDetails = {
    mistakes,
    addMistake,
    reviewClearance,
    newMistakes,
    setNewMistakes,
    reviewVFRDeparture,
  };

  return (
    <MistakeContext.Provider value={value}>{children}</MistakeContext.Provider>
  );
}
