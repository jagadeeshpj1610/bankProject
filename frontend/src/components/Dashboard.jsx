import React from 'react'
import Logout from "./Logout"
import Welcome from './Welcome'
import Deposit from './Deposit'
import Createaccount from './Createaccount'
import { Link } from 'react-router-dom'


export const Dashboard = () => {
  return (
    <>
    <div>Welcome to Online Banking system 
      <p>You are now in our banking application website</p>
    </div>
    <nav>
      <Link to = '/home' >Home</Link>
      <Link to = '/moneytransfer' > MoneyTransfer</Link>
      <Link to= '/deposit' >Deposit</Link>
      <Link to= '/createaccount' >Create Account</Link>
      <Link  to= '/'>logout</Link>
    </nav>
    </>
  )
}
