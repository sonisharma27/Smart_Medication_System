



import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:3000/user/verify-otp", {
        email,
        otp
      });

      alert("Email Verified Successfully");

      // 👉 go to login page
      navigate("/login");

    } catch (err) {
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Verify OTP</h2>

      <p>OTP sent to: <b>{email}</b></p>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{
          padding: "10px",
          width: "200px",
          marginTop: "10px"
        }}
      />

      <br /><br />

      <button onClick={handleVerify}>
        Verify OTP
      </button>
    </div>
  );
}

export default VerifyOtp;

