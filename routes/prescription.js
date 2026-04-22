const express = require("express");
const multer = require("multer");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");

const upload = multer({ dest: "uploads/" });

router.post("/scan", upload.single("image"), prescriptionController.scanPrescription);
router.post("/voice", prescriptionController.processVoiceInput);

module.exports = router;