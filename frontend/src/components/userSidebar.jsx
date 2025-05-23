import { NavLink } from 'react-router-dom';
import '../css/App.css';

const UserSidebar = () => {
  return (
    <div className="sidebarContainer">
      <h2 className="sidebarTitle">User Panel</h2>
      <nav className="sidebarNav">
        <ul className="navList">
          <li className="navItem">
            <NavLink to="/userhome" className="navLink" activeClassName="activeNavLink">
              Home
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/usermoneytransfer" className="navLink" activeClassName="activeNavLink">
              Money Transfer
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/logout" className="navLink" activeClassName="activeNavLink">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;
