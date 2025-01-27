import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/App.css';

const AdminSidebar = () => {
  return (
    <div className="sidebarContainer">
      <h2 className="sidebarTitle">Admin Panel</h2>
      <nav className="sidebarNav">
        <ul className="navList">
          <li className="navItem">
            <NavLink to="/home/adminhome" className="navLink" activeClassName="activeNavLink">
              Home
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/home/createaccount" className="navLink" activeClassName="activeNavLink">
              Create Account
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/home/deposit" className="navLink" activeClassName="activeNavLink">
              Deposit
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/home/withdraw" className="navLink" activeClassName="activeNavLink">
              Withdraw
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/home/moneytransfer" className="navLink" activeClassName="activeNavLink">
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

export default AdminSidebar;
