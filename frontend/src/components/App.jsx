import { Dashboard } from "./Dashboard";
import LoginPage from "./loginPage";
import Signup from "./Signup";
import Welcome from "./Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Logout from "./Logout";
import Moneytransfer from "./Moneytransfer";
import Deposit from "./Deposit";
import Createaccount from "./Createaccount";
import AdminLoginPage from "./adminLoginPage";
import Adminhome from "./Adminhome";
import AdminSignup from "./adminSignup";
import Withdraw from "./withdraw";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/userlogin" element={<LoginPage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Dashboard />}>
          <Route path="adminhome" element = {<Adminhome/>} />
          <Route path="moneytransfer" element={<Moneytransfer />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="createaccount" element={<Createaccount />} />
          <Route path="logout" element={<Logout />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
