import { useEffect, useState } from 'react';
import { useSimulation } from '../../hooks/useSimulation';

export function Vignette() {
  const [windowHasFocus, setWindowHasFocus] = useState(true);
  const { paused } = useSimulation();

  useEffect(() => {
    function onBlur() {
      setWindowHasFocus(false);
    }

    function onFocus() {
      setWindowHasFocus(true);
    }

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  });

  if (!windowHasFocus && !paused) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          boxShadow: 'inset 0 0 100px 25px #000',
          zIndex: '1000',
          pointerEvents: 'none',
        }}
      ></div>
    );
  }
}
