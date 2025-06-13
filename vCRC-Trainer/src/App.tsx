
import './App.css'
import { FlightPlanProvider } from './providers/FlightPlanProvider';
import { CGgroundPage } from './pages/CGroundPage';
import { StripsProvider } from './providers/StripsProvider';
import { useEffect } from 'react';
import { MessagesProvider } from './providers/MessagesProvider';
import { SimulationProvider } from './providers/SimulationProvider';


function App() {

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

  return (
    <FlightPlanProvider>
      <StripsProvider>
        <MessagesProvider>
          <SimulationProvider>
            <CGgroundPage/>
          </SimulationProvider>
        </MessagesProvider>
      </StripsProvider>
    </FlightPlanProvider>
  )
}

export default App
