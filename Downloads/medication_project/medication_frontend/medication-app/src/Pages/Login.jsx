// import { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post("http://localhost:3000/user/login", form);

//       localStorage.setItem("token", res.data.data.token);

//       alert("Login Successful");
//       navigate("/profile");
//     } catch (err) {
//       alert("Invalid Credentials");
//     }
//   };

//   return (
//     <div className="container mt-5 d-flex justify-content-center align-items-center vh-500">
//       <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
//         <h3 className="text-center mb-3">Login</h3>

//         <form onSubmit={handleSubmit}>
//           <input className="form-control mb-3" type="email" name="email" placeholder="Email" onChange={handleChange} />
//           <input className="form-control mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} />

//           <button className="btn btn-success w-100">Login</button>
//         </form>

//         <p className="mt-3 text-center">
//           New user? <Link to="/register">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Login({ show, handleClose, openRegister }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

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
      const res = await axios.post(
        "http://localhost:3000/user/login",
        form
      );

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("email", form.email);

      alert("Login Successful");

      // Reset form
      setForm({
        email: "",
        password: ""
      });

      handleClose(); // close modal
      navigate("/dashboard");

      // update navbar
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("navbar.login")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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

          <Button type="submit" variant="success" className="w-100">
            {t("navbar.login")}
          </Button>
        </Form>

        <div className="text-center mt-3">
          {t("auth.newAccount")}{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={openRegister}
          >
            {t("navbar.register")}
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default Login;