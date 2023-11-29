import classes from "../Styles/Login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [blank, setBlank] = useState(false);

  useEffect(() => {
    if (username.length === 0 || password.length === 0){
      setBlank(true);
    } else {
      setBlank(false);
    }
  }, [username, password])

  const login = (e) => {
    e.preventDefault();

  if (blank) {
    setError('Please fill in both username and password fields.');
    return;
  }

  const data = {
    username: username,
    password: password,
  };

  axios
    .post("http://127.0.0.1:8000/auth/", data, {
      headers: { 'Content-Type': 'application/json'}
    })
    .then((res) => {
      if (res.status === 200) {
        // successful login
        // send user to dashboard
        // for now:
        console.log('login successful')
      } else {
        // unsuccessful login
        setError("Login failed. Please check username and password.")
      }
    })
    .catch((error) => {
      // fun for debugging
      console.error(error);
      setError('error occured which logging in.')
    });
  };

  return (
    <div className={classes.loginContainer}>
      <p>Login</p>
      <form className={classes.loginForm}>
        <div className={classes.username}>
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input 
            type="password"
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={classes.errorMsg}>{error}</p>}
        <button type="submit" onClick={login}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/PreSignup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;