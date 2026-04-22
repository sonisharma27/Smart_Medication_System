import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

function OTPModal({ show, handleClose, email, onVerificationSuccess }) {
  const { t } = useLanguage();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/user/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        alert("Verification successful! You can now log in.");
        onVerificationSuccess(); // This will trigger opening the login modal
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("auth.verifyOtp")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">
          {t("auth.otpSent")}
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder={t("auth.enterOtp")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
              className="text-center fw-bold"
              style={{ fontSize: "1.5rem", letterSpacing: "5px" }}
            />
          </Form.Group>

          {error && <p className="text-danger text-center">{error}</p>}

          <Button 
            type="submit" 
            variant="success" 
            className="w-100 py-2" 
            disabled={loading}
          >
            {loading ? t("auth.verifying") : t("auth.verify")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default OTPModal;
