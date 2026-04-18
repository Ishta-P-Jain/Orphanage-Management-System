// ============================================
//  mailer.js — MODIFIED FILE
//  Only change: added sendOtpEmail() function.
//  All existing functions are word-for-word
//  identical to the previous version.
// ============================================

const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('EMAIL_USER or EMAIL_PASS is missing in your .env file!');
} else {
  console.log('Email config loaded for:', process.env.EMAIL_USER);
}

const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

transporter.verify((error) => {
  if (error) {
    console.error('EMAIL IS NOT WORKING. Reason:', error.message);
    console.error('Fix: Check EMAIL_USER and EMAIL_PASS in backend/.env');
    console.error('     Use Gmail App Password, not your real password.');
  } else {
    console.log('Email is connected and ready!');
  }
});

// Internal helper
const sendEmail = async (mailOptions) => {
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent to:', mailOptions.to, '| ID:', info.messageId);
};

// Shared HTML shell
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

// ── EXISTING FUNCTION 1 — sendRegistrationEmail (UNCHANGED) ──
const sendRegistrationEmail = async (toEmail, name) => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
  });
  const body = `
    <h2 style="color:#27ae60;margin-top:0;">Registration Successful!</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      Thank you for registering with our orphanage. We appreciate your support.
    </p>
    <div style="background:#eafaf1;border-left:4px solid #27ae60;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Email: ${toEmail}<br/>Registered on: ${now}<br/>Account Status: Active
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#27ae60;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Log In Now</a>
    </div>
    <p style="font-size:12px;color:#aaa;">If you did not create this account, please ignore this email.</p>
  `;
  await sendEmail({
    from: `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'You have successfully registered - Orphanage Manager',
    html: emailShell(body),
  });
};

// ── EXISTING FUNCTION 2 — sendLoginEmail (UNCHANGED) ──
const sendLoginEmail = async (toEmail, name) => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
  });
  const body = `
    <h2 style="color:#4a90e2;margin-top:0;">Login Confirmed!</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      You have successfully logged into the <strong>Orphanage Manager</strong> portal. Welcome back!
    </p>
    <div style="background:#eaf4ff;border-left:4px solid #4a90e2;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Account: ${toEmail}<br/>Login Time: ${now}
      </p>
    </div>
    <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#7d6608;line-height:1.8;">
        Security Notice: If you did NOT log in just now, please change your password immediately.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#4a90e2;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Open Dashboard</a>
    </div>
  `;
  await sendEmail({
    from: `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'You have successfully logged in - Orphanage Manager',
    html: emailShell(body),
  });
};

// ── EXISTING FUNCTION 3 — sendDonationEmail (UNCHANGED) ──
const sendDonationEmail = async (toEmail, name, amount) => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
  });
  const body = `
    <h2 style="color:#27ae60;margin-top:0;">Thank You for Your Donation! 💰</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Dear <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      Thank you for your donation request. We appreciate your support.
    </p>
    <div style="background:#eafaf1;border-left:4px solid #27ae60;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Donor: ${name}<br/>
        Amount: ₹${Number(amount).toLocaleString('en-IN')}<br/>
        Date: ${now}<br/>
        Status: Received ✅
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#27ae60;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Visit Dashboard</a>
    </div>
  `;
  await sendEmail({
    from: `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Thank you for your donation - Orphanage Manager',
    html: emailShell(body),
  });
};

// ── EXISTING FUNCTION 4 — sendApplicationEmail (UNCHANGED) ──
const sendApplicationEmail = async (toEmail, name, applicationType) => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short',
  });
  const body = `
    <h2 style="color:#8e44ad;margin-top:0;">Application Received! 📋</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Dear <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      Thank you for your ${applicationType.toLowerCase()} application. We will contact you soon.
    </p>
    <div style="background:#f5eef8;border-left:4px solid #8e44ad;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Applicant: ${name}<br/>
        Application Type: ${applicationType}<br/>
        Submitted on: ${now}<br/>
        Status: Pending Review 🔍
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#8e44ad;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Visit Dashboard</a>
    </div>
  `;
  await sendEmail({
    from: `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Thank you for your ${applicationType} application - Orphanage Manager`,
    html: emailShell(body),
  });
};

// ── NEW FUNCTION 5 — sendOtpEmail ─────────────
// Sends a 6-digit OTP to verify the user's email
// before they can submit a donation or adoption form.
const sendOtpEmail = async (toEmail, otp) => {
  const body = `
    <h2 style="color:#2c3e50;margin-top:0;">Your Email Verification Code 🔑</h2>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      You requested to verify your email address for a form submission on
      <strong>Orphanage Manager</strong>. Use the code below:
    </p>

    <!-- Big OTP display box -->
    <div style="text-align:center;margin:28px 0;">
      <div style="
        display:inline-block;
        background:#f0f4f8;
        border:2px dashed #4a90e2;
        border-radius:10px;
        padding:20px 40px;
      ">
        <p style="margin:0;font-size:13px;color:#888;letter-spacing:1px;">YOUR OTP CODE</p>
        <p style="
          margin:8px 0 0;
          font-size:42px;
          font-weight:900;
          color:#2c3e50;
          letter-spacing:10px;
          font-family:monospace;
        ">${otp}</p>
      </div>
    </div>

    <!-- Expiry warning -->
    <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#7d6608;line-height:1.8;">
        ⏱️ <strong>This OTP expires in 10 minutes.</strong><br/>
        Do not share this code with anyone. Our team will never ask for it.
      </p>
    </div>

    <p style="font-size:13px;color:#aaa;">
      If you did not request this code, please ignore this email.
    </p>
  `;

  await sendEmail({
    from: `"Orphanage Manager" <${process.env.EMAIL_USER}>`,
    to:   toEmail,
    subject: 'Your OTP for Email Verification - Orphanage Manager',
    html: emailShell(body),
  });
};

module.exports = {
  sendRegistrationEmail,   // existing
  sendLoginEmail,          // existing
  sendDonationEmail,       // existing
  sendApplicationEmail,    // existing
  sendOtpEmail,            // NEW
};
