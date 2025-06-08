
import './App.css'
import { FlightPlanProvider } from './providers/FlightPlanProvider';
import { CGgroundPage } from './pages/CGroundPage';


function App() {
  return (
    <FlightPlanProvider>
      <CGgroundPage/>
    </FlightPlanProvider>
  )
}

export default App
