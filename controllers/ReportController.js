// const MedicationTransaction = require("../models/Medication");

// // ==============================
// // GET REPORT DATA
// // ==============================
// exports.getReportData = async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware

//     const transactions = await MedicationTransaction
//       .find({ user: userId })
//       .sort({ date: -1 });

//     res.status(200).json({
//       success: true,
//       data: transactions
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching report data"
//     });
//   }
// };

// // ==============================
// // UPLOAD REPORT FILE
// // ==============================
// exports.uploadReport = async (req, res) => {
//   try {
//     res.status(200).json({
//       success: true,
//       message: "File uploaded successfully",
//       fileName: req.file.filename
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "File upload failed"
//     });
//   }
// };



const Medication = require("../models/Medication");

// ==============================
// GET REPORT DATA
// ==============================
exports.getReportData = async (req, res) => {
  try {

    const userId = req.user._id;

    const medications = await Medication
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: medications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching report data"
    });

  }
};