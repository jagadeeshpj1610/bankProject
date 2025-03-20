import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSisebar";
import UserSidebar from "./userSidebar";
import UserHome from "./userDashboard";
import AdminHome from "./Adminhome";
import LoginPage from "./loginPage";
import ForgotPassword from "./ForgotPassword";
import MoneyTransfer from "./Moneytransfer";
import CreateAccount from "./AccountCreation";

import UserMoneyTransfer from "../components/userMoneyTransfer";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

import Logout from "./Logout";
import Welcome from "./Welcome";
import UserSignup from "./Signup";
import Header from "./header";
import Footer from "./footer";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/userhome" element={<ProtectedRoute role="user"><div className="mainContent"><UserSidebar /><UserHome /></div></ProtectedRoute>} />
        <Route path="/usermoneytransfer" element={<ProtectedRoute role="user"><div className="mainContent"><UserSidebar /><UserMoneyTransfer /></div></ProtectedRoute>} />
        <Route path="/home/adminhome" element={<ProtectedRoute role="admin"><div className="mainContent"><AdminSidebar /><AdminHome /></div></ProtectedRoute>} />
        <Route path="/createaccount" element={<ProtectedRoute role="admin"><div className="mainContent"><AdminSidebar /><CreateAccount /></div></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute role="admin"><div className="mainContent"><AdminSidebar /><Deposit /></div></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute role="admin"><div className="mainContent"><AdminSidebar /><Withdraw /></div></ProtectedRoute>} />
        <Route path="/moneytransfer" element={<ProtectedRoute role="admin"><div className="mainContent"><AdminSidebar /><MoneyTransfer /></div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
