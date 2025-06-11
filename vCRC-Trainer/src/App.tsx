
import './App.css'
import { FlightPlanProvider } from './providers/FlightPlanProvider';
import { CGgroundPage } from './pages/CGroundPage';
import { StripsProvider } from './providers/StripsProvider';
import { useEffect } from 'react';


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
  
        <CGgroundPage/>
      </StripsProvider>
    </FlightPlanProvider>
  )
}

export default App
