import classes from "../Styles/Navbar.module.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <header>
      <nav>
        <p>Welcome</p>
        <p>
          <Link className={classes.profileLink} to={`/account/testuser`}>
            Profile
          </Link>
        </p>
      </nav>
    </header>
  );
}

export default Navbar;
