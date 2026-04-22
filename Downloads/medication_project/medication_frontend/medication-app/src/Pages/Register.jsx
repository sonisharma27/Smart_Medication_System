


import { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
function Register({ show, handleClose, openLogin, onRegisterSuccess }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
  alert("Please enter a valid email address");
  return;
}

    try {
      const response = await axios.post("http://localhost:3000/user/register", form);
      if (response.data.success) {
        alert(response.data.message || "OTP sent to your email");
        
        const emailToVerify = form.email;
        // Reset form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: ""
        });

        onRegisterSuccess(emailToVerify);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("navbar.register")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="firstName"
              placeholder={t("auth.firstName")}
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              name="lastName"
              placeholder={t("auth.lastName")}
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder={t("auth.email")}
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder={t("auth.password")}
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            {t("navbar.register")}
          </Button>
        </Form>

        <div className="text-center mt-3">
          {t("auth.alreadyAccount")}{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={openLogin}
          >
            {t("navbar.login")}
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Register;