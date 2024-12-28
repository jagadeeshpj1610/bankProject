import { Dashboard } from "./Dashboard"
import Header from "./header"
import LoginPage from "./loginPage"
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Signup } from "./Signup"
import Welcome from "./Welcome"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

function App() {

  return (
    <>
    <Router > 
     <Routes >
      <Route path="/" element = { <Welcome/>} />
      <Route path="/home" element = { <Dashboard /> }/>
      <Route path="/login" element = {<LoginPage /> }/>
      <Route path="/signup" element = { <Signup />} />
     </Routes>
    </Router>
    
    </>
  )
}

export default App
