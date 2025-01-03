import { Dashboard } from "./Dashboard"
import LoginPage from "./loginPage"
import { Signup } from "./Signup"
import Welcome from "./Welcome"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Logout from "./Logout"
import Moneytransfer from "./Moneytransfer"
import Deposit from "./Deposit"
import Createaccount from "./Createaccount"

function App() {

  return (
    <>
    <Router > 
      
     < Routes>
      <Route path="/" element = { <Welcome/>} />
      <Route path="/login" element = { <LoginPage /> }/>
      <Route path="/signup" element = { <Signup />} />
     </Routes>

     <Routes>
       <Route path="/home" element = {<Dashboard />} />
        <Route path="/logout" element = { <Logout />} />
        <Route path="/moneytransfer" element = {<Moneytransfer/>} />
        <Route path="/deposit" element = {<Deposit/>} />
        <Route path="/createaccount" element = {<Createaccount/>} />
      </Routes>
    </Router>
    
    </>
  )
}

export default App
