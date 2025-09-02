
import './App.css'
import { FlightPlanProvider } from './providers/FlightPlanProvider';
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


function App() {
  const [welcomeOpen, setWelcomeOpen] = useState(true);

  useEffect(() => {
    function handleWindowUnload(event: any){
      event.preventDefault();
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleWindowUnload);
    return () => {
        window.removeEventListener("beforeunload", handleWindowUnload);
    }
  }, []);


  if(welcomeOpen){
      return (
          <DifficultyProvider>
            <PrefRoutesProvider loadSilently={true}>
              <Welcome setWelcomeOpen={setWelcomeOpen}></Welcome>
            </PrefRoutesProvider>
          </DifficultyProvider>
      )
      
  }

  return (
    <DifficultyProvider>
      <PrefRoutesProvider loadSilently={false}>
        <ParkingSpotProvider>
          <FlightPlanProvider>
            <MistakeProvider>
              <StripsProvider>
                <MessagesProvider>
                  <SimulationProvider>
                    <CGgroundPage/>
                  </SimulationProvider>
                </MessagesProvider>
              </StripsProvider>
            </MistakeProvider>
          </FlightPlanProvider>
        </ParkingSpotProvider>
      </PrefRoutesProvider>
    </DifficultyProvider>
  )
}

export default App
