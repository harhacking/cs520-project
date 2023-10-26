// import Navbar from "../Components/Navbar";
import classes from "../Styles/Login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
  function login(e) {
    let username = "testuser";
    let password = "test";

    let data = {
      "username":username,
      "password": password,
    }

    e.preventDefault();
    const config = {
      method : "post",
      url : "http://127.0.0.1:8000/auth/",
      headers : {
          "Content-Type":"application/json",  
      },
      data : JSON.stringify(data)
  }
    axios(config)
      .then((res) => {
        console.log(res);
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
          <input type="text" id="username" />
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <button type="submit" onClick={login}>Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}

export default Login;
