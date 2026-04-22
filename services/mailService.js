const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-app-password",    // Replace with your app password
  },
});

async function sendOTPMail(email, otp) {
  try {
    const mailOptions = {
      from: '"SmartMed" <your-email@gmail.com>',
      to: email,
      subject: "Verify your email - SmartMed",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #0d6efd;">Welcome to SmartMed!</h2>
          <p>Please use the following OTP to verify your email address:</p>
          <div style="font-size: 24px; font-weight: bold; color: #333; padding: 10px; background: #f4f4f4; border-radius: 5px; text-align: center; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best Regards,<br>SmartMed Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send OTP email");
  }
}

async function sendReminderMail(email, medicineName, dosage, time) {
  try {
    const mailOptions = {
      from: '"SmartMed" <your-email@gmail.com>',
      to: email,
      subject: `Medication Reminder: ${medicineName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 15px; max-width: 600px; margin: auto;">
          <div style="background: linear-gradient(45deg, #2193b0, #6dd5ed); padding: 20px; border-radius: 10px 10px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0;">Medication Reminder</h1>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Hello,</p>
            <p>It's time to take your medication.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Medicine:</strong> ${medicineName}</p>
              <p style="margin: 5px 0;"><strong>Dosage:</strong> ${dosage}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
            </div>
            <p>Please make sure to take it on time to maintain your health.</p>
            <br>
            <p style="font-size: 0.9em; color: #777;">Best Regards,<br>SmartMed Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${email} for ${medicineName}`);
  } catch (err) {
    console.error("Error sending reminder email:", err);
  }
}

module.exports = { sendOTPMail, sendReminderMail };
