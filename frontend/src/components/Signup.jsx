import React from 'react'
import '../css/signup.css'
import { Link } from 'react-router-dom'



export const Signup = () => {
  return (
    <>
    <div>
      <p> welcome to signup</p>
  <Link to= '/login'><p>back to login page</p></Link>
    </div>
      </>
  )
}
