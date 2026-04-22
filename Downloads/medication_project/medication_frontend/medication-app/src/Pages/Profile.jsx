// import { useState, useEffect } from "react";
// import axios from "axios";

// function Profile() {
//   const token = localStorage.getItem("token");

//   const [profile, setProfile] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     mobile: "",
//     medicalCondition: "",
//     address: ""
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/user/get/profile", {
//         headers: { Authorization: "Bearer " + token }
//       });

//       setProfile(res.data);
//     } catch (err) {
//       console.log("No profile found");
//     }
//   };

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://localhost:3000/user/create/profile", profile, {
//         headers: { Authorization: "Bearer " + token }
//       });

//       alert("Profile Saved");
//       fetchProfile();
//     } catch (err) {
//       alert("Error saving profile");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card p-4 shadow">
//         <h3 className="text-center mb-3">Profile</h3>

//         <form onSubmit={handleSubmit}>
//           <input className="form-control mb-3" name="name" placeholder="Name" value={profile.name} onChange={handleChange} />
//           <input className="form-control mb-3" type="number" name="age" placeholder="Age" value={profile.age} onChange={handleChange} />

//           <select className="form-control mb-3" name="gender" value={profile.gender} onChange={handleChange}>
//             <option value="">Select Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//             <option>Other</option>
//           </select>

//           <input className="form-control mb-3" name="mobile" placeholder="Mobile" value={profile.mobile} onChange={handleChange} />
//           <input className="form-control mb-3" name="medicalCondition" placeholder="Medical Condition" value={profile.medicalCondition} onChange={handleChange} />
//           <textarea className="form-control mb-3" name="address" placeholder="Address" value={profile.address} onChange={handleChange}></textarea>

//           <button className="btn btn-primary w-100">Save Profile</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Profile;




import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";

function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    medicalCondition: "",
    address: "",
    profileImage: ""
  });
  const [email, setEmail] = useState("");
  const [isProfileExists, setIsProfileExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/user/get/profile",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
        setIsProfileExists(true);
        setIsEditing(false); 
        if (res.data.data.profileImage) {
          setImagePreview(`http://localhost:3000${res.data.data.profileImage}`);
        }
      } else if (res.data.data) {
        const { name, email: userEmail } = res.data.data;
        setProfile({
          name: name || "",
          age: "",
          gender: "",
          mobile: "",
          medicalCondition: "",
          address: "",
          profileImage: ""
        });
        setEmail(userEmail || "");
        setIsProfileExists(false);
        setIsEditing(true); 
      }

    } catch (err) {
      console.log("Error fetching profile", err);
      setIsProfileExists(false);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        await axios.delete("http://localhost:3000/user/delete/profile", {
          headers: { Authorization: "Bearer " + token }
        });
        alert("Profile deleted successfully");
        fetchProfile(); // Reset state
      } catch (err) {
        alert("Error deleting profile");
      }
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("age", profile.age);
    formData.append("gender", profile.gender);
    formData.append("mobile", profile.mobile);
    formData.append("medicalCondition", profile.medicalCondition);
    formData.append("address", profile.address);
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      if (isProfileExists) {
        await axios.put(
          "http://localhost:3000/user/edit/profile",
          formData,
          {
            headers: { 
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("Profile Updated");
      } else {
        await axios.post(
          "http://localhost:3000/user/create/profile",
          formData,
          {
            headers: { 
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("Profile Created");
      }

      setIsEditing(false);
      fetchProfile();

    } catch (err) {
      alert("Error saving profile");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
        <div className="card-header bg-gradient text-white d-flex justify-content-between align-items-center py-4" style={{ background: "linear-gradient(45deg, #2193b0, #6dd5ed)" }}>
          <h4 className="mb-0 fw-bold">
            <i className="bi bi-person-circle me-2"></i> {t("profile.title")}
          </h4>
          {isProfileExists && !isEditing && (
            <div className="d-flex gap-2">
              <Button variant="light" className="rounded-pill px-3 shadow-sm" size="sm" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil-square me-1"></i> {t("profile.edit")}
              </Button>
              <Button variant="outline-light" className="rounded-pill px-3 shadow-sm" size="sm" onClick={handleDelete}>
                <i className="bi bi-trash me-1"></i> {t("profile.delete")}
              </Button>
            </div>
          )}
        </div>

        <div className="card-body p-5">
          <div className="row">
            <div className="col-lg-4 text-center mb-4 mb-lg-0">
              <div className="position-relative d-inline-block">
                <div 
                  className="rounded-circle border shadow-sm mx-auto overflow-hidden bg-light d-flex align-items-center justify-content-center"
                  style={{ width: "200px", height: "200px", border: "5px solid #fff" }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-100 h-100 object-fit-cover" />
                  ) : (
                    <i className="bi bi-person-fill text-muted" style={{ fontSize: "100px" }}></i>
                  )}
                </div>
                {isEditing && (
                  <label 
                    htmlFor="profilePhoto" 
                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{ width: "45px", height: "45px", cursor: "pointer", border: "3px solid #fff" }}
                  >
                    <i className="bi bi-camera-fill"></i>
                    <input 
                      type="file" 
                      id="profilePhoto" 
                      className="d-none" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </label>
                )}
              </div>
              <div className="mt-3">
                <h5 className="fw-bold text-dark mb-0">{profile.name || "User Name"}</h5>
                <p className="text-muted small">{email || localStorage.getItem("email")}</p>
              </div>
            </div>

            <div className="col-lg-8">
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.fullName")}</Form.Label>
                        <Form.Control 
                          name="name" 
                          placeholder={t("profile.fullName")} 
                          value={profile.name} 
                          onChange={handleChange} 
                          required 
                          className="rounded-pill px-4 py-2 bg-light border-0"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Group>
                        <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.emailAccount")}</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={email || localStorage.getItem("email")} 
                          readOnly 
                          disabled 
                          className="rounded-pill px-4 py-2 bg-light border-0"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.age")}</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="age" 
                        placeholder={t("profile.age")} 
                        value={profile.age} 
                        onChange={handleChange} 
                        required 
                        className="rounded-pill px-4 py-2 bg-light border-0"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.gender")}</Form.Label>
                      <Form.Select 
                        name="gender" 
                        value={profile.gender} 
                        onChange={handleChange} 
                        required 
                        className="rounded-pill px-4 py-2 bg-light border-0"
                      >
                        <option value="">{t("profile.gender")}</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </div>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.mobile")}</Form.Label>
                    <Form.Control 
                      name="mobile" 
                      placeholder={t("profile.mobile")} 
                      value={profile.mobile} 
                      onChange={handleChange} 
                      required 
                      className="rounded-pill px-4 py-2 bg-light border-0"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.medicalCondition")}</Form.Label>
                    <Form.Control 
                      name="medicalCondition" 
                      placeholder={t("profile.medicalCondition")} 
                      value={profile.medicalCondition} 
                      onChange={handleChange} 
                      required 
                      className="rounded-pill px-4 py-2 bg-light border-0"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("profile.address")}</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      name="address" 
                      placeholder={t("profile.address")} 
                      value={profile.address} 
                      onChange={handleChange} 
                      required 
                      className="rounded-4 px-4 py-2 bg-light border-0"
                    />
                  </Form.Group>

                  <div className="d-flex gap-3 mt-4">
                    <Button type="submit" variant="primary" className="rounded-pill px-5 py-2 fw-bold shadow-sm flex-grow-1">
                      {isProfileExists ? t("profile.update") : t("profile.create")}
                    </Button>
                    {isProfileExists && (
                      <Button variant="outline-secondary" className="rounded-pill px-4 py-2" onClick={() => setIsEditing(false)}>
                        {t("profile.cancel")}
                      </Button>
                    )}
                  </div>
                </Form>
              ) : (
                <div className="profile-info">
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-person text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("profile.fullName")}</div>
                          <div className="fs-5 fw-medium text-dark">{profile.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-envelope text-info"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("auth.email")}</div>
                          <div className="fs-5 fw-medium text-dark">{email || localStorage.getItem("email")}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-calendar-event text-warning"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("profile.age")}</div>
                          <div className="fs-5 fw-medium text-dark">{profile.age} {t("profile.years")}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-gender-ambiguous text-danger"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("profile.gender")}</div>
                          <div className="fs-5 fw-medium text-dark">{profile.gender}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-telephone text-success"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("profile.mobile")}</div>
                          <div className="fs-5 fw-medium text-dark">{profile.mobile}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-secondary bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-heart-pulse text-secondary"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("profile.medicalCondition")}</div>
                          <div className="fs-5 fw-medium text-dark">
                            <span className="badge rounded-pill bg-info text-dark px-3 py-2">{profile.medicalCondition}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex align-items-start mb-3">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bi bi-geo-alt text-primary"></i>
                        </div>
                        <div>
                          <div className="text-muted small text-uppercase fw-bold">{t("profile.address")}</div>
                          <div className="fs-6 fw-medium text-dark text-wrap">{profile.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;