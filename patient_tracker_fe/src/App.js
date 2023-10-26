import './App.css';
import AppointmentCard from './Components/AppointmentCard';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Signup from "./Pages/Signup";
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Navbar />
      <AppointmentCard />
      
    </div>
  );
}

export default App;