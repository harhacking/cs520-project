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
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
      </Routes>
      
    </div>
  );
}

export default App;