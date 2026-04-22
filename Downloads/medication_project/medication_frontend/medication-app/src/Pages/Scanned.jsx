import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";

function Scanned() {
  const { t } = useLanguage();
  const token = localStorage.getItem("token");
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  
  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    reminderTime: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    notes: ""
  });

  const formatTime = (time) => {
    if (!time) return "";
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const scanImage = async (imageFile) => {
    setIsScanning(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post(
        "http://localhost:3000/prescription/scan",
        formData
      );

      if (res.data.success) {
        const { extractedText, parsedData } = res.data;
        setExtractedText(extractedText);
        setForm({
          ...form,
          medicineName: parsedData.medicineName || "",
          dosage: parsedData.dosage || "",
          frequency: parsedData.frequency || "once",
          reminderTime: parsedData.reminderTime || ["08:00"],
          startDate: parsedData.startDate || new Date().toISOString().split('T')[0],
          endDate: parsedData.endDate || ""
        });
      }
    } catch (err) {
      console.error(err);
      alert("Scanning failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const processVoice = async (transcript) => {
    setIsScanning(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/prescription/voice",
        { text: transcript },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.success) {
        const { extractedText, parsedData } = res.data;
        setExtractedText(extractedText);
        setForm({
          ...form,
          medicineName: parsedData.medicineName || form.medicineName,
          dosage: parsedData.dosage || form.dosage,
          frequency: parsedData.frequency || form.frequency || "once",
          reminderTime: parsedData.reminderTime || form.reminderTime || ["08:00"],
          startDate: parsedData.startDate || form.startDate,
          endDate: parsedData.endDate || form.endDate
        });
      }
    } catch (err) {
      console.error(err);
      alert("Processing voice failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      processVoice(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
      alert("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) scanImage(file);
  };

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], "prescription.jpg", { type: "image/jpeg" });
    scanImage(file);
    setShowCamera(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalReminderTime = [...form.reminderTime];
    if (form.frequency === "once" && !finalReminderTime[0]) finalReminderTime[0] = "08:00";
    if (form.frequency === "twice") {
      if (!finalReminderTime[0]) finalReminderTime[0] = "08:00";
      if (!finalReminderTime[1]) finalReminderTime[1] = "20:00";
    }
    if (form.frequency === "thrice") {
      if (!finalReminderTime[0]) finalReminderTime[0] = "08:00";
      if (!finalReminderTime[1]) finalReminderTime[1] = "14:00";
      if (!finalReminderTime[2]) finalReminderTime[2] = "20:00";
    }
    
    const payload = { ...form, reminderTime: finalReminderTime };

    try {
      await axios.post(
        "http://localhost:3000/medication/create",
        payload,
        { headers: { Authorization: "Bearer " + token } }
      );
      alert("Medication added successfully!");
      setForm({
        medicineName: "",
        dosage: "",
        frequency: "",
        reminderTime: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        notes: ""
      });
      setExtractedText("");
    } catch (err) {
      console.error(err);
      alert("Failed to save medication");
    }
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary mb-2">
          <i className="bi bi-qr-code-scan me-2"></i> {t("scanner.title")}
        </h2>
        <p className="text-muted">Use AI to scan your doctor's prescription and set reminders instantly.</p>
      </div>

      <Row className="g-4">
        {/* Scanner Section */}
        <Col lg={6}>
          <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "20px", overflow: "hidden" }}>
            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold"><i className="bi bi-camera-fill me-2"></i> Camera Input</span>
              {isScanning && <Badge bg="warning" text="dark" className="pulse">Scanning...</Badge>}
            </div>
            <Card.Body className="bg-light p-0 position-relative" style={{ minHeight: "350px" }}>
              {showCamera ? (
                <div className="position-relative">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-100"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                  <div className="scanner-overlay"></div>
                  <div className="position-absolute bottom-0 start-50 translate-middle-x pb-3 w-100 px-3 d-flex gap-2">
                    <Button variant="success" className="rounded-pill flex-grow-1 py-2 fw-bold" onClick={captureImage}>
                      <i className="bi bi-camera me-2"></i> {t("scanner.capture")}
                    </Button>
                    <Button variant="danger" className="rounded-circle" onClick={() => setShowCamera(false)}>
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5">
                  <i className="bi bi-cloud-arrow-up text-primary" style={{ fontSize: "60px" }}></i>
                  <h5 className="mt-3 fw-bold">No Input Selected</h5>
                  <p className="text-muted small mb-4 text-center">Capture a photo or upload a file to start scanning</p>
                  <div className="d-flex gap-2 w-100 flex-wrap">
                    <Button variant={isListening ? "danger" : "success"} className="rounded-pill flex-grow-1 py-2" onClick={startListening}>
                      {isListening ? (
                        <><Spinner size="sm" animation="grow" className="me-2" /> Listening...</>
                      ) : (
                        <><i className="bi bi-mic-fill me-2"></i> Voice</>
                      )}
                    </Button>
                    <Button variant="primary" className="rounded-pill flex-grow-1 py-2" onClick={() => setShowCamera(true)}>
                      <i className="bi bi-camera-video me-2"></i> {t("scanner.camera")}
                    </Button>
                    <div className="position-relative flex-grow-1">
                      <Button variant="outline-primary" className="rounded-pill w-100 py-2">
                        <i className="bi bi-file-earmark-image me-2"></i> {t("scanner.upload")}
                      </Button>
                      <input 
                        type="file" 
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-white p-4">
              <h6 className="fw-bold text-muted mb-2 small text-uppercase">Extracted Text Preview</h6>
              <div className="bg-light p-3 rounded-3" style={{ height: "120px", overflowY: "auto", fontSize: "0.85rem" }}>
                {isScanning ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                    <span>Processing with AI...</span>
                  </div>
                ) : extractedText || <span className="text-muted italic">{t("scanner.placeholder")}</span>}
              </div>
            </Card.Footer>
          </Card>
        </Col>

        {/* Data Form Section */}
        <Col lg={6}>
          <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "20px" }}>
            <div className="card-header bg-primary text-white py-3">
              <span className="fw-bold"><i className="bi bi-clipboard2-check me-2"></i> {t("scanner.result")}</span>
            </div>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted small text-uppercase">{t("medication.name")}</Form.Label>
                  <Form.Control 
                    name="medicineName" 
                    placeholder="e.g. Paracetamol" 
                    value={form.medicineName} 
                    onChange={handleChange} 
                    required 
                    className="rounded-pill px-4 py-2 border-light bg-light"
                  />
                </Form.Group>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("medication.dosage")}</Form.Label>
                    <Form.Control 
                      name="dosage" 
                      placeholder="e.g. 500mg" 
                      value={form.dosage} 
                      onChange={handleChange} 
                      required 
                      className="rounded-pill px-4 py-2 border-light bg-light"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("medication.frequency")}</Form.Label>
                    <Form.Select 
                      name="frequency" 
                      value={form.frequency} 
                      onChange={(e) => {
                        const freq = e.target.value;
                        let defaultTimes = [];
                        if (freq === "once") defaultTimes = ["08:00"];
                        else if (freq === "twice") defaultTimes = ["08:00", "20:00"];
                        else if (freq === "thrice") defaultTimes = ["08:00", "14:00", "20:00"];
                        setForm({ ...form, frequency: freq, reminderTime: defaultTimes });
                      }} 
                      required 
                      className="rounded-pill px-4 py-2 border-light bg-light"
                    >
                      <option value="once">Once a day</option>
                      <option value="twice">Twice a day</option>
                      <option value="thrice">Thrice a day</option>
                    </Form.Select>
                  </Col>
                </Row>

                {form.frequency === "once" && (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">Time</Form.Label>
                    <Form.Control type="time" value={form.reminderTime[0] || ""} onChange={(e) => setForm({ ...form, reminderTime: [e.target.value] })} className="rounded-pill px-4 py-2 border-light bg-light" />
                  </Form.Group>
                )}
                {form.frequency === "twice" && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">Morning Time</Form.Label>
                      <Form.Control type="time" value={form.reminderTime[0] || ""} onChange={(e) => setForm({ ...form, reminderTime: [e.target.value, form.reminderTime[1]] })} className="rounded-pill px-4 py-2 border-light bg-light" />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">Evening Time</Form.Label>
                      <Form.Control type="time" value={form.reminderTime[1] || ""} onChange={(e) => setForm({ ...form, reminderTime: [form.reminderTime[0], e.target.value] })} className="rounded-pill px-4 py-2 border-light bg-light" />
                    </Col>
                  </Row>
                )}
                {form.frequency === "thrice" && (
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">Morning</Form.Label>
                      <Form.Control type="time" value={form.reminderTime[0] || ""} onChange={(e) => setForm({ ...form, reminderTime: [e.target.value, form.reminderTime[1], form.reminderTime[2]] })} className="rounded-pill px-4 py-2 border-light bg-light" />
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">Afternoon</Form.Label>
                      <Form.Control type="time" value={form.reminderTime[1] || ""} onChange={(e) => setForm({ ...form, reminderTime: [form.reminderTime[0], e.target.value, form.reminderTime[2]] })} className="rounded-pill px-4 py-2 border-light bg-light" />
                    </Col>
                    <Col md={4} className="mb-3">
                      <Form.Label className="fw-bold text-muted small text-uppercase">Night</Form.Label>
                      <Form.Control type="time" value={form.reminderTime[2] || ""} onChange={(e) => setForm({ ...form, reminderTime: [form.reminderTime[0], form.reminderTime[1], e.target.value] })} className="rounded-pill px-4 py-2 border-light bg-light" />
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("medication.startDate")}</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="startDate" 
                      value={form.startDate} 
                      onChange={handleChange} 
                      required 
                      className="rounded-pill px-4 py-2 border-light bg-light"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="fw-bold text-muted small text-uppercase">{t("medication.endDate")}</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="endDate" 
                      value={form.endDate} 
                      onChange={handleChange} 
                      className="rounded-pill px-4 py-2 border-light bg-light"
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted small text-uppercase">{t("medication.notes")}</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="notes" 
                    placeholder="Special instructions..." 
                    value={form.notes} 
                    onChange={handleChange} 
                    className="rounded-4 px-4 py-2 border-light bg-light"
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="rounded-pill w-100 py-3 fw-bold shadow-sm">
                  <i className="bi bi-plus-circle me-2"></i> {t("scanner.save")}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .scanner-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 60%;
          border: 2px solid #28a745;
          border-radius: 10px;
          box-shadow: 0 0 0 1000px rgba(0,0,0,0.3);
          pointer-events: none;
        }
        .scanner-overlay::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #28a745;
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .pulse {
          animation: pulse-animation 1.5s infinite;
        }
        @keyframes pulse-animation {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
}

export default Scanned;