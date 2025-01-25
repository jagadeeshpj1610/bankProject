import '../css/dashboard.css'
import React from 'react'
import { Link,NavLink, Outlet } from 'react-router-dom'
import Header from './header'


export const Dashboard = () => {
  return (
    <>
    <div>
      <Header />
    </div>
   <main >
    <div className='navigationsContainer' >
    <nav>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}} to = 'adminhome' >Home</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to = 'moneytransfer' > MoneyTransfer</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= 'withdraw' >Withdraw</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= 'deposit' >Deposit</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= 'createaccount' >Create Account</NavLink>
      <NavLink className = {(e) => {return e.isActive ? "active" : ''}}  to= 'logout'>logout</NavLink>
    </nav>
    </div>

    <div className='contentShowingPage' >
      <Outlet />
    </div>
   </main>
    </>
  )
}
