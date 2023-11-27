import './App.css';
import AppointmentCard from './Components/AppointmentCard';
import Navbar from './Components/Navbar';
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from './Pages/Home';
import DoctorSignup from './Pages/DoctorSignup'
import {Routes, Route} from "react-router-dom"
import PreSignup from './Pages/PreSignup';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Login />}/>
        <Route path='/signup' exact  element={<Signup />}/>
        <Route path='/home' exact element={<Home />}/>
        <Route path='/presignup' exact element={<PreSignup/>}/>
        <Route path='/DoctorSignup' exact element={<DoctorSignup/>}/>

      </Routes>
      
    </div>
  );
}

export default App;