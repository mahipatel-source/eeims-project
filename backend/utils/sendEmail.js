const nodemailer = require('nodemailer');

// create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send email helper
const sendEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `EEIMS System <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">EEIMS Notification</h2>
          <p>${message}</p>
          <hr/>
          <small style="color: #999;">This is an automated message from EEIMS system.</small>
        </div>
      `,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email sending failed:', err);
  }
};

module.exports = sendEmail;