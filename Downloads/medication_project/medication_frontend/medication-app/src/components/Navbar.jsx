import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import OTPModal from "./OTPModal";
import { useLanguage } from "../context/LanguageContext";
import { Form } from "react-bootstrap";

function NavBar() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const doLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <Container fluid>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container fluid>

          {/* 🔵 PROJECT NAME */}
          <Navbar.Brand
            className="fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            💊 SmartMed
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>

            {/* 🔵 LEFT MENU */}
            <Nav className="me-auto">

              {isLoggedIn && (
                <>
                  <Nav.Link onClick={() => navigate("/dashboard")}>
                    📊 {t("navbar.dashboard")}
                  </Nav.Link>

                  <Nav.Link onClick={() => navigate("/medication")}>
                    💊 {t("navbar.medications")}
                  </Nav.Link>

                  <Nav.Link onClick={() => navigate("/profile")}>
                    👤 {t("navbar.profile")}
                  </Nav.Link>
                </>
              )}

            </Nav>

            {/* 🔵 RIGHT SIDE */}
            <div className="d-flex align-items-center gap-3">
              
              {/* 🌐 Language Switcher */}
              <Form.Select 
                size="sm" 
                style={{ width: "auto", background: "#333", color: "white", border: "1px solid #555" }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </Form.Select>

              {isLoggedIn ? (
                <>
                  <div className="text-white d-flex align-items-center">
                    <i
                      className="bi bi-person-circle text-info"
                      style={{ fontSize: "1.8rem", marginRight: "8px" }}
                    ></i>
                    <span>{userEmail}</span>
                  </div>

                  <Button variant="danger" onClick={doLogout}>
                    <i className="bi bi-box-arrow-right"></i> {t("navbar.logout")}
                  </Button>
                </>
              ) : (
                <Button variant="success" onClick={() => setShowLoginModal(true)}>
                  <i className="bi bi-box-arrow-in-right"></i> {t("navbar.login")}
                </Button>
              )}

            </div>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Login
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        openRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <Register
        show={showRegisterModal}
        handleClose={() => setShowRegisterModal(false)}
        openLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
        onRegisterSuccess={(email) => {
          setTempEmail(email);
          setShowRegisterModal(false);
          setShowOTPModal(true);
        }}
      />

      {/* OTP Modal */}
      <OTPModal
        show={showOTPModal}
        handleClose={() => setShowOTPModal(false)}
        email={tempEmail}
        onVerificationSuccess={() => {
          setShowOTPModal(false);
          setShowLoginModal(true);
        }}
      />

    </Container>
  );
}

export default NavBar;