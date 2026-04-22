const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");
const ReportController = require("../controllers/ReportController");

// ==============================
// MULTER STORAGE
// ==============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ==============================
// ROUTES (YOUR STYLE)
// ==============================
// router.get('/report/data', auth, (req, res) => {
//   ReportController.getReportData(req, res);
// });
router.get('/report/data', auth, ReportController.getReportData);
router.post('/report/upload', auth, upload.single("file"), (req, res) => {
  ReportController.uploadReport(req, res);
});

module.exports = router;