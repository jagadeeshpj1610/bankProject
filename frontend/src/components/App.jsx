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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/userlogin" element={<LoginPage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Dashboard />}>
          <Route path="moneytransfer" element={<Moneytransfer />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="createaccount" element={<Createaccount />} />
        </Route>
        
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
