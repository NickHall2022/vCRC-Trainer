import { useEffect, useState } from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { SPEECH_AVAILABLE } from '../../utils/constants/speech';
import { useSpeech } from '../../hooks/useSpeech';

export function Vignette() {
  const [windowHasFocus, setWindowHasFocus] = useState(true);
  const { paused } = useSimulation();
  const { voiceSwitchEnabled } = useSpeech();

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

  if (!windowHasFocus && !paused && SPEECH_AVAILABLE && voiceSwitchEnabled) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          boxShadow: 'inset 0 0 100px 25px #00000085',
          zIndex: '1000',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="dataBlock"
          style={{ pointerEvents: 'none', padding: '5px', fontSize: '16px', color: 'yellow' }}
        >
          Window unfocused - Push to talk unavailable
        </span>
      </div>
    );
  }
}
