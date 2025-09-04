import { taxiways } from '../../utils/taxiways';

export function Taxiways() {
  function createTaxiways() {
    return taxiways.map((taxiway) => {
      return (
        <div
          style={{
            position: 'absolute',
            left: `${taxiway.x}%`,
            top: `${taxiway.y}%`,
            zIndex: 100,
            width: '3px',
            height: '3px',
            backgroundColor: 'black',
          }}
          key={`${taxiway.x}+${taxiway.y}`}
        ></div>
      );
    });
  }

  return <>{createTaxiways()}</>;
}
