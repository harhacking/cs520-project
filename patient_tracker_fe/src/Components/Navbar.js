import classes from "../Styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  function logoutHandler() {
    axios
      .post("http://127.0.0.1:8000/logout/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        navigate("/");
        localStorage.removeItem("token")
        console.log("token after deleting", localStorage.getItem("token"));
      });
  }

  return (
    <header>
      <nav>
        <p>PatientTracker</p>
        <div className = {classes.actions}>
        <p>
          <Link className={classes.profileLink} to={`/account/testuser`}>
            Profile
          </Link>
        </p>
        <button onClick={logoutHandler}>Logout</button>
        </div>
        
      </nav>
    </header>
  );
}

export default Navbar;
