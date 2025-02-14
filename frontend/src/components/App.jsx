import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSisebar";
import UserSidebar from "./userSidebar";
import UserHome from "./userDashboard";
import AdminHome from "./Adminhome";
import LoginPage from "./LoginPage";
import AdminLoginPage from "./adminLoginPage";
import MoneyTransfer from "./Moneytransfer";
import CreateAccount from "./CreateAccount";
import UserMoneyTransfer from "../components/userMoneyTransfer";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Logout from "./Logout";
import Welcome from "./Welcome";
import UserSignup from "./Signup";
import Header from "./header";
// import Checkbalance from "./checkBalance";
import Footer from "./footer";

const App = () => {


  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/usersignup" element={<UserSignup />} />
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/userhome" element={<><UserSidebar /><div className="mainContent"><UserHome /></div></>} />
          <Route path="/moneytransfer" element={<><UserSidebar /><div className="mainContent"><UserMoneyTransfer /></div></>} />
          {/* <Route path="/checkbalance" element={<><UserSidebar /><div className="mainContent"><Checkbalance /></div></>} /> */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/home/adminhome" element={<><AdminSidebar /><div className="mainContent"><AdminHome /></div></>} />
          <Route path="/home/createaccount" element={<><AdminSidebar /><div className="mainContent"><CreateAccount /></div></>} />
          <Route path="/home/deposit" element={<><AdminSidebar /><div className="mainContent"><Deposit /></div></>} />
          <Route path="/home/withdraw" element={<><AdminSidebar /><div className="mainContent"><Withdraw /></div></>} />
          <Route path="/home/moneytransfer" element={<><AdminSidebar /><div className="mainContent"><MoneyTransfer /></div></>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
};

export default App;
