
import './App.css'
import { FlightPlanProvider } from './providers/FlightPlanProvider';
import { CGgroundPage } from './pages/CGroundPage';
import { StripsProvider } from './providers/StripsProvider';


function App() {
  return (
    <FlightPlanProvider>
      <StripsProvider>
        <CGgroundPage/>
      </StripsProvider>
    </FlightPlanProvider>
  )
}

export default App
