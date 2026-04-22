import NavBar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import Sidebarmenu from "./Sidebarmenu";
import NotificationService from "./NotificationService";


import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Dashboard from "../Pages/Dashboard";
import Medication from "../Pages/Medication";
import Profile from "../Pages/Profile";
import ReportPage from "../Pages/ReportPage";
import Scanned from "../Pages/Scanned";
import VerifyOtp from "../Pages/VerifyOtp";

function Layout() {
  return (
    <div>
      <NotificationService />
      <NavBar />

      <Sidebarmenu>
        <Routes>
          {/* Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp></VerifyOtp>} /> 

          <Route path="/login" element={<Login />} />

          {/* Main App Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medication" element={<Medication />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/report" element={<ReportPage/>} />
          <Route path="/scanned" element={<Scanned/>} />

          {/* Default Route */}
          <Route index element={<Dashboard />} />
        </Routes>
      </Sidebarmenu>
    </div>
  );
}

export default Layout;