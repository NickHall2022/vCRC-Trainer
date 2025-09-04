import { useAircraft } from '../../hooks/useAircraft';
import { useSimulation } from '../../hooks/useSimulation';
import type { Aircraft } from '../../types/common';

export function Airplane({ aircraft }: { aircraft: Aircraft }) {
  const { setSelectedFlightPlan } = useAircraft();

  const { completeRequest } = useSimulation();

  function handleClick(event: React.MouseEvent) {
    if (event.ctrlKey) {
      setSelectedFlightPlan(aircraft.callsign);
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
}
