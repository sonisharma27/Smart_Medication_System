const cron = require("node-cron");
const Medication = require("../models/Medication");
const { sendReminderMail } = require("./mailService");

// Runs every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const medications = await Medication.find({
      reminderTime: { $in: [currentTime] },
      startDate: { $lte: today },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: today } }
      ]
    }).populate("user");

    medications.forEach((med) => {
      if (med.user && med.user.email) {
        console.log(`🔔 Sending Reminder to ${med.user.email} for ${med.medicineName}`);
        sendReminderMail(med.user.email, med.medicineName, med.dosage, currentTime);
      }
    });

  } catch (err) {
    console.log("Reminder error:", err.message);
  }
});