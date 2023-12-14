import classes from "../Styles/Signup.module.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function PatientSignup() {
  // Initializing necessary hooks and form validation
  const navigate = useNavigate();
  const form = useForm({ mode: "all" });
  const { register, handleSubmit, formState, watch, getValues } = form;
  const { errors } = formState;

  // Valid blood groups for validation
  const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Validation function for blood group
  const validateBloodGroup = (value) => {
    return (
      validBloodGroups.includes(value.toUpperCase()) || "Invalid blood group"
    );
  };

  // Validation rules for numeric inputs
  const inputValidationRules = {
    required: "Cannot be empty",
    pattern: {
      value: /^\d+(\.\d{0,2})?$/,
      message: "Invalid format",
    },
    validate: (value) => parseFloat(value) >= 0 || "Value cannot be negative",
  };

  // Function to check if passwords match
  function passwordMatch() {
    if (
      getValues("confirmPassword") &&
      getValues("confirmPassword") !== getValues("password")
    ) {
      return <p className={classes.errorMessage}>Passwords do not match</p>;
    }
    return <p></p>;
  }

  // State for storing signup data
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

  // Function to handle signup process
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
        // Handling successful signup response
        const token = res.data.token;
        localStorage.setItem("token", token);
        const firstName = signupData.first_name;
        const lastName = signup.lastName;
        const name = firstName + " " + lastName;
        // Navigating to home page with user information
        navigate("/", {
          state: {
            isDoctor: false,
            patient_name: name,
            username: signupData.username,
          },
        });
        localStorage.setItem("patientId", res.data.id);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Function to update signupData state with form input values
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

   // Rendering the patient signup form
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
              {...register("first_name", {
                required: "First name cannot be empty",
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.first_name?.message}</p>
          </div>

          <div className={classes.lastname}>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="last_name"
              {...register("last_name", {
                required: "Last name cannot be empty",
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.last_name?.message}</p>
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.email}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email", {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
                required: "Email cannot be empty",
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.email?.message}</p>
          </div>

          <div className={classes.username}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              {...register("username", {
                required: "Username cannot be empty",
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.username?.message}</p>
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.password}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              {...register("password", {
                required: "Password cannot be empty",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Must contain at least 1 upper and lowercase letter, one digit, and 1 special character",
                },
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.password?.message}</p>
          </div>
          <div className={classes.confirmPassword}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              {...register("confirmPassword", {
                required: "Password cannot be empty",
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>
              {errors.confirmPassword?.message}
            </p>
            {passwordMatch()}
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
              {...register("blood_group", {
                required: "Cannot be empty",
                validate: validateBloodGroup,
              })}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>
              {errors.blood_group?.message}
            </p>
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.height}>
            <label htmlFor="height">Height (cm)</label>
            <input
              type="height"
              id="height"
              name="height"
              {...register("height", inputValidationRules)}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.height?.message}</p>
          </div>

          <div className={classes.wieght}>
            <label htmlFor="weight">Weight (lbs)</label>
            <input
              type="weight"
              id="weight"
              name="weight"
              {...register("weight", inputValidationRules)}
              onChange={setFormData}
            />
            <p className={classes.errorMessage}>{errors.weight?.message}</p>
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
