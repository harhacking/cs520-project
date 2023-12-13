import classes from "../Styles/Signup.module.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function PatientSignup() {
  const navigate = useNavigate();
  const form = useForm({ mode: "all" });
  const { register, handleSubmit, formState, watch, getValues } = form;
  const { errors } = formState;
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    medical_history: "",
    medications: "",
    diagnoses: "",
    blood_group: "",
    height: "",
    weight: "",
  });

  function signup(event) {
    event.preventDefault();
    axios
      .post(
        "http://127.0.0.1:8000/api/patient/register/",
        JSON.stringify(signupData),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        navigate("/patient_home");
        localStorage.setItem("patientId", res.data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function setFormData(event) {
    event.preventDefault();
    const {
      target: { name, value },
    } = event;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  return (
    <div className={classes.signupContainer}>
      <p>Signup</p>
      <form className={classes.signupForm}>
        <div className={classes.groupsOfTwo}>
          <div className={classes.firstname}>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="first_name"
              onChange={setFormData}
            />
          </div>

          <div className={classes.lastname}>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="last_name"
              onChange={setFormData}
            />
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.email}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={setFormData}
            />
          </div>

          <div className={classes.username}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={setFormData}
            />
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.password}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={setFormData}
            />
          </div>
          <div className={classes.confirmPassword}>
            <label htmlFor="confirmPassword">Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={setFormData}
            />
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.medical_history}>
            <label htmlFor="medical_history">Medical History</label>
            <input
              type="medical_history"
              id="medical_history"
              name="medical_history"
              onChange={setFormData}
            />
          </div>

          <div className={classes.medications}>
            <label htmlFor="medications">Medications</label>
            <input
              type="medications"
              id="medications"
              name="medications"
              onChange={setFormData}
            />
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.diagnoses}>
            <label htmlFor="diagnoses">Diagnoses</label>
            <input
              type="diagnoses"
              id="diagnoses"
              name="diagnoses"
              onChange={setFormData}
            />
          </div>

          <div className={classes.blood_group}>
            <label htmlFor="blood_group">Blood Group</label>
            <input
              type="blood_group"
              id="blood_group"
              name="blood_group"
              onChange={setFormData}
            />
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.height}>
            <label htmlFor="height">Height (cm)</label>
            <input
              type="height"
              id="height"
              name="height"
              onChange={setFormData}
            />
          </div>

          <div className={classes.wieght}>
            <label htmlFor="weight">Weight (lbs)</label>
            <input
              type="weight"
              id="weight"
              name="weight"
              onChange={setFormData}
            />
          </div>
        </div>

        <button type="submit" onClick={signup}>
          Signup
        </button>
      </form>
      <p>
        Already a user? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
export default PatientSignup;
