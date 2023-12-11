import classes from "../Styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "./AxiosInstance";

function Navbar(props) {
  const navigate = useNavigate();
  function logoutHandler() {
    axiosInstance.post("logout/").then((res) => {
      navigate("/");
      localStorage.removeItem("token");
    });
  }

  return (
    <header>
      <nav>
        <p>
          <Link
            to={props.is_doctor ? "/doctor_home" : "/patient_home"}
            state={{ username: props.username, is_doctor: props.is_doctor }}
          >
            Patient Tracker
          </Link>
        </p>
        <div className={classes.actions}>
          <p>
            <Link
              className={classes.profileLink}
              to={`/account/${props.username}`}
              state={{ username: props.username, is_doctor: props.is_doctor }}
            >
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
