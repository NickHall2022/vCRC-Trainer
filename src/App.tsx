import './App.css';
import { AircraftProvider } from './providers/AircraftProvider';
import { CGgroundPage } from './pages/CGroundPage';
import { StripsProvider } from './providers/StripsProvider';
import { useEffect, useState } from 'react';
import { MessagesProvider } from './providers/MessagesProvider';
import { SimulationProvider } from './providers/SimulationProvider';
import { PrefRoutesProvider } from './providers/PrefRoutesProvider';
import { ParkingSpotProvider } from './providers/ParkingSpotProvider';
import Welcome from './components/Menus/Welcome';
import { DifficultyProvider } from './providers/DifficultyProvider';
import { MistakeProvider } from './providers/MistakeProvider';
import { SpeechProvider } from './providers/SpeechProvider.tsx';
import { SpeechInterpretatonProvider } from './providers/SpeechInterpretationProvider.tsx';
import { SPEECH_AVAILABLE } from './utils/constants/speech.ts';

function App() {
  const [welcomeOpen, setWelcomeOpen] = useState(true);

  useEffect(() => {
    function handleWindowUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleWindowUnload);
    return () => {
      window.removeEventListener('beforeunload', handleWindowUnload);
    };
  }, []);

  if (welcomeOpen) {
    return (
      <DifficultyProvider>
        <PrefRoutesProvider loadSilently={true}>
          <Welcome setWelcomeOpen={setWelcomeOpen}></Welcome>
        </PrefRoutesProvider>
      </DifficultyProvider>
    );
  }

  const innerChildren = SPEECH_AVAILABLE ? (
    <SpeechInterpretatonProvider>
      <SpeechProvider>
        <CGgroundPage />
      </SpeechProvider>
    </SpeechInterpretatonProvider>
  ) : (
    <CGgroundPage />
  );

  return (
    <DifficultyProvider>
      <PrefRoutesProvider loadSilently={false}>
        <ParkingSpotProvider>
          <AircraftProvider>
            <MistakeProvider>
              <StripsProvider>
                <MessagesProvider>
                  <SimulationProvider>{innerChildren}</SimulationProvider>
                </MessagesProvider>
              </StripsProvider>
            </MistakeProvider>
          </AircraftProvider>
        </ParkingSpotProvider>
      </PrefRoutesProvider>
    </DifficultyProvider>
  );
}

export default App;
