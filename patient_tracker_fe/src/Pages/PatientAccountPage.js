import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Toast from "../Components/Toast";
import { useForm } from "react-hook-form";
import classes from "../Styles/PatientAccountPage.module.css";
import { useLocation, useNavigate } from "react-router";
import axiosInstance from "../Components/AxiosInstance";

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

function PatientAccountPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [userData, setUserData] = useState({
    height: "",
    weight: "",
    blood_group: "",
    diagnoses: "",
    medical_history: "",
    medications: "",
  });

  const form = useForm({ mode: "all", defaultValues: userData });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;
  const [toastMessage, setToastMessage] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    axiosInstance
      .get("api/patient/details/")
      .then((res) => {
        const userData = res.data.Patient;
        setUserData(userData);
        reset(userData);
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 403) {
          navigate("/");
        }
      });
  }, []);

  // Hide toast message after 2 seconds
  useEffect(() => {
    if (toastMessage !== "") {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Update user data state on input change
  const editPatientDetails = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle the edit profile form submission
  const editProfileHandler = () => {
    const data = JSON.stringify(userData);
    axiosInstance
      .put("api/patient/details/", data)
      .then((res) => {
        setToastMessage(res.data.message);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  // Render the patient account page
  return (
    <div className={classes.accountPageContainer}>
      {toastMessage && <Toast isErrorMessage={false}>{toastMessage}</Toast>}
      <Navbar username={state.username} is_doctor={state.is_doctor} />
      <form noValidate onSubmit={handleSubmit(editProfileHandler)}>
        <h1>Welcome, {localStorage.getItem("name")}</h1>
        {/* Input fields for height, weight, blood group, diagnoses, medical history, and medications */}
        {/* ... (similar structure for other input fields) */}
        <div className={classes.groupsOfTwo}>
          <div className={classes.detail}>
            <label>Height</label>
            <div className={classes.inputWrapper}>
              <input
                value={userData.height}
                name="height"
                id="height"
                {...register("height", inputValidationRules)}
                onChange={editPatientDetails}
              />
              <p className={classes.errorMessage}>{errors.height?.message}</p>
            </div>
          </div>

          <div className={classes.detail}>
            <label>Weight</label>
            <div className={classes.inputWrapper}>
              <input
                value={userData.weight}
                name="weight"
                id="weight"
                {...register("weight", inputValidationRules)}
                onChange={editPatientDetails}
              />
              <p className={classes.errorMessage}>{errors.weight?.message}</p>
            </div>
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.detail}>
            <label>Blood Group</label>
            <div className={classes.inputWrapper}>
              <input
                value={userData.blood_group}
                name="blood_group"
                id="blood_group"
                {...register("blood_group", {
                  required: "Cannot be empty",
                  validate: validateBloodGroup,
                })}
                onChange={editPatientDetails}
              />
              <p className={classes.errorMessage}>
                {errors.blood_group?.message}
              </p>
            </div>
          </div>

          <div className={classes.detail}>
            <label>Diagnoses</label>
            <div className={classes.inputWrapper}>
              <textarea
                id="diagnoses"
                value={userData.diagnoses}
                name="diagnoses"
                {...register("diagnoses", { required: "Cannot be empty" })}
                onChange={editPatientDetails}
              ></textarea>
              <p className={classes.errorMessage}>
                {errors.diagnoses?.message}
              </p>
            </div>
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.detail}>
            <label>Medical History</label>
            <div className={classes.inputWrapper}>
              <textarea
                id="medical_history"
                value={userData.medical_history}
                name="medical_history"
                {...register("medical_history", {
                  required: "Cannot be empty",
                })}
                onChange={editPatientDetails}
              ></textarea>
              <p className={classes.errorMessage}>
                {errors.medical_history?.message}
              </p>
            </div>
          </div>

          <div className={classes.detail}>
            <label>Medications</label>
            <div className={classes.inputWrapper}>
              <textarea
                id="medications"
                value={userData.medications}
                name="medications"
                {...register("medications", { required: "Cannot be empty" })}
                onChange={editPatientDetails}
              ></textarea>
              <p className={classes.errorMessage}>
                {errors.medications?.message}
              </p>
            </div>
          </div>
        </div>

        <button type="submit" className={classes.editProfileBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default PatientAccountPage;
