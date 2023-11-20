// import Navbar from "../Components/Navbar";
import classes from "../Styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function Login() {
  const form = useForm({ mode: "all" });
  const { register, control, handleSubmit, formState, clearErrors, watch } =
    form;
  const { errors, isDirty, isValid } = formState;

  const username = watch("username", "");
  const password = watch("password", "");
  const [formErrors, setFormErrors] = useState({
    usernameError: "",
    passwordError: "",
  });

  const loginHandler = (e) => {
    const data = {
      username: username,
      password: password,
    };

    axios
      .post("http://127.0.0.1:8000/auth/", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.status === 200) {
          // send user to dashboard on successful login
          console.log("login successful"); 
        } else {
          // Dummy error messages for now. Get actual from backend response
          setFormErrors({
            usernameError: "Username error",
            passwordError: "Password error",
          });
        }
      })
      .catch((error) => {
        // fun for debugging
        console.error(error);
      });
  };

  return (
    <div className={classes.loginContainer}>
      <p>Login</p>
      <form
        className={classes.loginForm}
        onSubmit={handleSubmit(loginHandler)}
        noValidate
      >
        <div className={classes.username}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            {...register("username", {
              required: "Username cannot be empty",
            })}
          />
          <p className={classes.errorMessage}>
            {errors.username?.message || formErrors.usernameError}
          </p>
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
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
          />
          <p className={classes.errorMessage}>
            {errors.password?.message || formErrors.passwordError}
          </p>
        </div>

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
