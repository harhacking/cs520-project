import "./App.css";
// import AppointmentCard from './Components/AppointmentCard';
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import PatientSignup from "./Pages/PatientSignup";
import Home from "./Pages/Home";
import DoctorSignup from "./Pages/DoctorSignup";
import { Routes, Route } from "react-router-dom";
import PreSignup from "./Pages/PreSignup";
import PatientDashboard from "./Pages/PatientDashboard";
import PatientAccountPage from "./Pages/PatientAccountPage";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const token = localStorage.getItem("token")

  // useEffect(() => {
  //   axios.get("http://127.0.0.1:8000/isAuth/", {
  //     headers: {
  //       "Content-Type": "application/json",
  //     }
  //   }).then(res => {
  //     console.log(res.data)
  //     setIsAuth(res.data.isAuth)
  //   })
  // }, [])

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/PatientSignup" exact element={<PatientSignup />} />
        <Route path="/home" exact element={<Home />} />
        <Route path="/PreSignup" exact element={<PreSignup />} />
        <Route path="/DoctorSignup" exact element={<DoctorSignup />} />
        <Route path="/patient_home" exact element={<PatientDashboard />} />
        <Route path="/account/:username" element={<PatientAccountPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
