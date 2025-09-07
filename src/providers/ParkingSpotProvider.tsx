import { type ReactNode } from 'react';
import type { ParkingSpot, ParkingSpotMethods, ParkingSpotType } from '../types/common';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { ParkingSpotContext } from '../hooks/useParkingSpots';

type PartialParkingSpot = Omit<ParkingSpot, 'available' | 'id' | 'type' | 'pushbackLocation'>;

const AIRLINE_SPOTS: PartialParkingSpot[] = [
  {
    x: 58.5,
    y: 46.5,
    rotation: 70,
    pushbackIntoRamp: false,
    airline: 'UAL',
    location: '2',
  },
  {
    x: 57,
    y: 45,
    rotation: 70,
    pushbackIntoRamp: false,
    airline: 'SWA',
    location: '4',
  },
  {
    x: 55.5,
    y: 44.5,
    rotation: 70,
    pushbackIntoRamp: false,
    airline: 'MXY',
    location: '5',
  },
  {
    x: 54,
    y: 44,
    rotation: 70,
    pushbackIntoRamp: false,
    airline: 'FFT',
    location: '6',
  },
  {
    x: 52.5,
    y: 43.5,
    rotation: 70,
    pushbackIntoRamp: false,
    airline: 'DAL',
    location: '7',
  },
  {
    x: 51,
    y: 43,
    rotation: 70,
    pushbackIntoRamp: false,
    airline: 'DAL',
    location: '8',
  },

  {
    x: 50,
    y: 42,
    rotation: 30,
    pushbackIntoRamp: true,
    airline: 'AAL',
    location: '9',
  },
  {
    x: 49.125,
    y: 40.25,
    rotation: 30,
    pushbackIntoRamp: true,
    airline: 'AAL',
    location: '10',
  },
  {
    x: 48.25,
    y: 38.5,
    rotation: 30,
    pushbackIntoRamp: true,
    airline: 'AAL',
    location: '11',
  },
  {
    x: 47.365,
    y: 36.75,
    rotation: 30,
    pushbackIntoRamp: true,
    airline: 'AAL',
    location: '12',
  },
  {
    x: 46.5,
    y: 35,
    rotation: 30,
    pushbackIntoRamp: true,
    airline: 'AAL',
    location: '14',
  },
];

const GA_SPOTS: PartialParkingSpot[] = [
  {
    x: 62.5,
    y: 34,
    rotation: 0,
    pushbackIntoRamp: false,
    location: 'north ramp',
  },
  {
    x: 62.8,
    y: 32,
    rotation: 180,
    pushbackIntoRamp: false,
    location: 'north ramp',
  },
  {
    x: 62.1,
    y: 30,
    rotation: 0,
    pushbackIntoRamp: false,
    location: 'north ramp',
  },
  {
    x: 62.4,
    y: 28,
    rotation: 180,
    pushbackIntoRamp: false,
    location: 'north ramp',
  },
  {
    x: 62.7,
    y: 26,
    rotation: 0,
    pushbackIntoRamp: false,
    location: 'north ramp',
  },
];

const TEC_SPOTS: PartialParkingSpot[] = [
  {
    x: 61,
    y: 47.5,
    rotation: 70,
    pushbackIntoRamp: false,
    location: 'gate 1B',
    airline: 'KAP',
  },
  {
    x: 63,
    y: 46.5,
    rotation: 170,
    pushbackIntoRamp: false,
    location: 'gate 1A',
    airline: 'KAP',
    taxiInstruction: {
      text: 'Runway 29, taxi via C, A, cross runway 36',
      phonetic: 'Runway two niner taxi via charlie alpha cross runway three six',
    },
  },
  {
    x: 63,
    y: 22,
    rotation: 0,
    pushbackIntoRamp: false,
    location: 'north ramp',
    taxiInstruction: {
      text: 'Runway 29, taxi via C, A, cross runway 36',
      phonetic: 'Runway two niner taxi via charlie alpha cross runway three six',
    },
  },
  {
    x: 63,
    y: 20,
    rotation: 180,
    pushbackIntoRamp: false,
    location: 'north ramp',
    taxiInstruction: {
      text: 'Runway 29, taxi via C, A, cross runway 36',
      phonetic: 'Runway two niner taxi via charlie alpha cross runway three six',
    },
  },
  {
    x: 63,
    y: 18,
    rotation: 0,
    pushbackIntoRamp: false,
    location: 'north ramp',
    taxiInstruction: {
      text: 'Runway 29, taxi via C, A, cross runway 36',
      phonetic: 'Runway two niner taxi via charlie alpha cross runway three six',
    },
  },
  {
    x: 63,
    y: 16,
    rotation: 180,
    pushbackIntoRamp: false,
    location: 'north ramp',
    taxiInstruction: {
      text: 'Runway 29, taxi via C, A, cross runway 36',
      phonetic: 'Runway two niner taxi via charlie alpha cross runway three six',
    },
  },
  {
    x: 75,
    y: 37,
    rotation: 270,
    pushbackIntoRamp: false,
    location: 'cargo ramp',
    airline: 'FDX',
    taxiInstruction: {
      text: 'Runway 29, taxi via G, join runway 18, A',
      phonetic: 'Runway two niner taxi via golf join runway one eight, alpha',
    },
  },
  {
    x: 76.5,
    y: 37.5,
    rotation: 90,
    pushbackIntoRamp: false,
    location: 'cargo ramp',
    airline: 'FDX',
    taxiInstruction: {
      text: 'Runway 29, taxi via G, join runway 18, A',
      phonetic: 'Runway two niner taxi via golf join runway one eight, alpha',
    },
  },
  {
    x: 78,
    y: 37,
    rotation: 270,
    pushbackIntoRamp: false,
    location: 'cargo ramp',
    airline: 'WIG',
    taxiInstruction: {
      text: 'Runway 29, taxi via G, join runway 18, A',
      phonetic: 'Runway two niner taxi via golf join runway one eight, alpha',
    },
  },
  {
    x: 79.5,
    y: 37.5,
    rotation: 90,
    pushbackIntoRamp: false,
    location: 'cargo ramp',
    airline: 'WIG',
    taxiInstruction: {
      text: 'Runway 29, taxi via G, join runway 18, A',
      phonetic: 'Runway two niner taxi via golf join runway one eight, alpha',
    },
  },
];

function calcPushbackLocation(x: number, y: number, rotation: number) {
  const angleAsRadians = (rotation * Math.PI) / 180;
  return {
    x: x - 4 * Math.cos(angleAsRadians),
    y: y + 4 * Math.sin(angleAsRadians),
  };
}

export function ParkingSpotProvider({ children }: { children: ReactNode }) {
  const [parkingSpots, setParkingSpots] = useImmer<ParkingSpot[]>([
    ...AIRLINE_SPOTS.map((spot) => {
      return {
        ...spot,
        available: true,
        id: uuidv4(),
        type: 'airline' as ParkingSpotType,
        pushbackLocation: calcPushbackLocation(spot.x, spot.y, spot.rotation),
      };
    }),
    ...GA_SPOTS.map((spot) => {
      return {
        ...spot,
        available: true,
        id: uuidv4(),
        type: 'ga' as ParkingSpotType,
        pushbackLocation: calcPushbackLocation(spot.x, spot.y, spot.rotation),
      };
    }),
    ...TEC_SPOTS.map((spot) => {
      return {
        ...spot,
        available: true,
        id: uuidv4(),
        type: 'TEC' as ParkingSpotType,
        pushbackLocation: calcPushbackLocation(spot.x, spot.y, spot.rotation),
      };
    }),
  ]);

  function reserveSpot(type: ParkingSpotType): ParkingSpot | undefined {
    const openSpots = parkingSpots.filter((spot) => spot.available && spot.type === type);
    if (openSpots.length === 0) {
      return;
    }
    const randomSpot = openSpots[Math.floor(Math.random() * openSpots.length)];
    setParkingSpots((draft) => {
      const replaceIndex = draft.findIndex((spot) => spot.id === randomSpot.id);
      if (replaceIndex !== -1) {
        draft[replaceIndex].available = false;
      }
    });
    return randomSpot;
  }

  function releaseSpot(id: string) {
    setParkingSpots((draft) => {
      const replaceIndex = draft.findIndex((spot) => spot.id === id);
      if (replaceIndex !== -1) {
        draft[replaceIndex].available = true;
      }
    });
  }

  function getPushbackLocation(id: string) {
    const spot = parkingSpots.find((spot) => spot.id === id);
    if (!spot) {
      throw 'Incorrectly defined parking spot id';
    }
    return spot.pushbackLocation;
  }

  function getParkingSpotPushbackIntoRamp(id: string) {
    const spot = parkingSpots.find((spot) => spot.id === id);
    if (!spot) {
      throw 'Incorrectly defined parking spot id';
    }
    return spot.pushbackIntoRamp;
  }

  const value: ParkingSpotMethods = {
    reserveSpot,
    releaseSpot,
    getPushbackLocation,
    getParkingSpotPushbackIntoRamp,
  };

  return <ParkingSpotContext.Provider value={value}>{children}</ParkingSpotContext.Provider>;
}
