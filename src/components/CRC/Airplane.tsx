import { useMemo } from 'react';
import type { Aircraft } from '../../types/common';
import {
  fireCompleteRequestEvent,
  fireSelectAircraftEvent,
} from '../../utils/constants/customEvents';

export function Airplane({ aircraft }: { aircraft: Aircraft }) {
  return useMemo(() => {
    function handleClick(event: React.MouseEvent) {
      if (event.ctrlKey) {
        fireSelectAircraftEvent(aircraft.callsign);
        return;
      }

      fireCompleteRequestEvent(aircraft.callsign);
    }

    return (
      <>
        <div>
          <img
            src="planeIcon.png"
            draggable={false}
            id={aircraft.callsign}
            onClick={handleClick}
            style={{
              width: `${aircraft.size}%`,
              position: 'absolute',
              top: `${aircraft.positionY}%`,
              left: `${aircraft.positionX}%`,
              transform: ` translate(-50%, -50%) rotate(${-aircraft.rotation}deg)`,
              cursor: 'pointer',
            }}
          ></img>
        </div>
      </>
    );
  }, [aircraft]);
}
