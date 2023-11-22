import './App.css';
import AppointmentCard from './Components/AppointmentCard';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Signup from "./Pages/Signup";
import Home from './Pages/Home';
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Login />}/>
        <Route path='/signup' exact  element={<Signup />}/>
        <Route path='/home' exact element={<Home />}/>

      </Routes>
      
    </div>
  );
}

export default App;