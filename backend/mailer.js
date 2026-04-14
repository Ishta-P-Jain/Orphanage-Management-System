// ============================================
//  mailer.js — Nodemailer Email Sender
//  Sends emails for: Registration & Login
// ============================================

const nodemailer = require('nodemailer');
require('dotenv').config();

// Warn early if .env values are missing
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('EMAIL_USER or EMAIL_PASS is missing in your .env file!');
} else {
  console.log('Email config loaded for:', process.env.EMAIL_USER);
}

// Create Gmail SMTP Transporter
// Using explicit host + port 587 (STARTTLS) - most reliable for Gmail
const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection when the server starts
// You'll see OK or ERROR in your terminal right when you run "node server.js"
transporter.verify((error) => {
  if (error) {
    console.error('\nEMAIL IS NOT WORKING. Reason:', error.message);
    console.error('HOW TO FIX:');
    console.error('  1. Open backend/.env');
    console.error('  2. Set EMAIL_USER=yourgmail@gmail.com');
    console.error('  3. Set EMAIL_PASS=abcdabcdabcdabcd  (no spaces, App Password only!)');
    console.error('  4. Enable 2-Step Verification: myaccount.google.com -> Security\n');
  } else {
    console.log('Email is connected and ready! Both register and login emails will work.');
  }
});

// Internal helper: sends any email
const sendEmail = async (mailOptions) => {
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent to:', mailOptions.to, '| ID:', info.messageId);
  return { success: true };
};

// Shared HTML email shell (branded header + footer)
const emailShell = (bodyContent) => `
  <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
    <div style="background:#2c3e50;padding:26px 30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;">Orphanage Manager</h1>
      <p style="color:#95a5a6;margin:6px 0 0;font-size:13px;">Caring for every child, every day</p>
    </div>
    <div style="padding:32px 30px;">${bodyContent}</div>
    <div style="background:#f8f9fa;padding:16px 30px;text-align:center;border-top:1px solid #eee;">
      <p style="color:#bbb;font-size:12px;margin:0;">
        This is an automated email - please do not reply.<br/>
        &copy; 2024 Orphanage Manager. All rights reserved.
      </p>
    </div>
  </div>
`;

// ============================================================
//  FUNCTION 1 - sendRegistrationEmail
//  Called right after a new user signs up successfully
// ============================================================
const sendRegistrationEmail = async (toEmail, name) => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const body = `
    <h2 style="color:#27ae60;margin-top:0;">Registration Successful!</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      Thank you for registering with our orphanage. We appreciate your support.
      Your account has been created and is ready to use.
    </p>
    <div style="background:#eafaf1;border-left:4px solid #27ae60;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Email: ${toEmail}<br/>
        Registered on: ${now}<br/>
        Account Status: Active
      </p>
    </div>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      You can now log in and start using the orphanage dashboard.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#27ae60;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">
        Log In Now
      </a>
    </div>
    <p style="font-size:12px;color:#aaa;">If you did not create this account, please ignore this email.</p>
  `;

  await sendEmail({
    from:    `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'You have successfully registered - Orphanage Manager',
    html:    emailShell(body),
  });
};

// ============================================================
//  FUNCTION 2 - sendLoginEmail
//  Called every time a user successfully logs in
// ============================================================
const sendLoginEmail = async (toEmail, name) => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const body = `
    <h2 style="color:#4a90e2;margin-top:0;">Login Confirmed!</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      You have successfully logged into the <strong>Orphanage Manager</strong> portal. Welcome back!
    </p>
    <div style="background:#eaf4ff;border-left:4px solid #4a90e2;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Account: ${toEmail}<br/>
        Login Time: ${now}<br/>
        Platform: Orphanage Manager Dashboard
      </p>
    </div>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      If this was you - great, you are all set! Head over to your dashboard.
    </p>
    <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#7d6608;line-height:1.8;">
        Security Notice: If you did NOT log in just now, please change your password immediately.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#4a90e2;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">
        Open Dashboard
      </a>
    </div>
  `;

  await sendEmail({
    from:    `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: 'You have successfully logged in - Orphanage Manager',
    html:    emailShell(body),
  });
};

module.exports = { sendRegistrationEmail, sendLoginEmail };
