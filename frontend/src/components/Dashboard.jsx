import '../css/dashboard.css'
import React from 'react'
import Logout from "./Logout"
import Welcome from './Welcome'
import Deposit from './Deposit'
import Createaccount from './Createaccount'
import { Link,NavLink, Outlet } from 'react-router-dom'
import Header from './header'


export const Dashboard = () => {
  return (
    <>
    <div>
      <Header />
    <p className='welcomeToOnlineBankingApplication'>Welcome to Online Banking Application</p>
    </div>
   <main >
    <div className='navigationsContainer' >
    <nav>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}} to = '/home' >Home</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to = 'moneytransfer' > MoneyTransfer</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= 'deposit' >Deposit</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= 'createaccount' >Create Account</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= '/'>logout</NavLink>
    </nav>
    </div>
    <div className='contentShowingPage' >
      <Outlet />  
    </div>
   </main>
    </>
  )
}
