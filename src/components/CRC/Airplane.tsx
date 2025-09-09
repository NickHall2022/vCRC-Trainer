import { useMemo, type RefObject } from 'react';
import type { Aircraft } from '../../types/common';
import { useSimulation } from '../../hooks/useSimulation';

export function Airplane({
  aircraft,
  selectPlaneRef,
}: {
  aircraft: Aircraft;
  selectPlaneRef: RefObject<((callsign: string) => void) | undefined>;
}) {
  const { completeRequest } = useSimulation();
  return useMemo(() => {
    function handleClick(event: React.MouseEvent) {
      if (event.ctrlKey && selectPlaneRef.current) {
        selectPlaneRef.current(aircraft.callsign);
        return;
      }

      completeRequest(aircraft.callsign);
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
  }, [aircraft, completeRequest, selectPlaneRef]);
}
