// import Navbar from "../Components/Navbar";
import classes from "../Styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  function setFormData(event) {
    event.preventDefault();
    const {
      target: { name, value },
    } = event;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }


  function login(event) {
    event.preventDefault();
    const config = {
      method: "post",
      url: "http://127.0.0.1:8000/auth/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(loginData),
    };
    axios(config)
      .then((res) => {
        console.log(res);
        navigate("/home");
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div className={classes.loginContainer}>
      <p>Login</p>
      <form className={classes.loginForm}>
        <div className={classes.username}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={setFormData}
          />
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={setFormData}
          />
        </div>
        <button type="submit" onClick={login}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
