import { Link } from "react-router-dom";

const UserNavbar = () => (
  <nav>
    <Link to="/userhome">User Home</Link>
    <Link to="/logout">Logout</Link>
  </nav>
);

export default UserNavbar;
