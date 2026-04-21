// ============================================
//  mailer.js — MODIFIED FILE
//  Only change: sendDonationEmail() now accepts
//  donationType and visitDate parameters so the
//  email reflects the actual offline donation.
//  All other functions are completely unchanged.
// ============================================

const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('EMAIL_USER or EMAIL_PASS is missing in your .env file!');
} else {
  console.log('Email config loaded for:', process.env.EMAIL_USER);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', port: 587, secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

transporter.verify((error) => {
  if (error) {
    console.error('EMAIL IS NOT WORKING. Reason:', error.message);
    console.error('Fix: Check EMAIL_USER and EMAIL_PASS in backend/.env');
  } else {
    console.log('Email is connected and ready!');
  }
});

const sendEmail = async (mailOptions) => {
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent to:', mailOptions.to, '| ID:', info.messageId);
};

const emailShell = (bodyContent) => `
  <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
    <div style="background:#2c3e50;padding:26px 30px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;">Hope Orphanage</h1>
      <p style="color:#95a5a6;margin:6px 0 0;font-size:13px;">Caring for every child, every day</p>
    </div>
    <div style="padding:32px 30px;">${bodyContent}</div>
    <div style="background:#f8f9fa;padding:16px 30px;text-align:center;border-top:1px solid #eee;">
      <p style="color:#bbb;font-size:12px;margin:0;">
        This is an automated email - please do not reply.<br/>
        &copy; 2026 Hope Orphanage. All rights reserved.
      </p>
    </div>
  </div>
`;

// ── FUNCTION 1 — sendRegistrationEmail (UNCHANGED) ──
const sendRegistrationEmail = async (toEmail, name) => {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
  const body = `
    <h2 style="color:#27ae60;margin-top:0;">Registration Successful!</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">Thank you for registering with our orphanage. We appreciate your support.</p>
    <div style="background:#eafaf1;border-left:4px solid #27ae60;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">Email: ${toEmail}<br/>Registered on: ${now}<br/>Account Status: Active</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#27ae60;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Log In Now</a>
    </div>
    <p style="font-size:12px;color:#aaa;">If you did not create this account, please ignore this email.</p>
  `;
  await sendEmail({ from: `"Hope Orphanage" <${process.env.EMAIL_USER}>`, to: toEmail, subject: 'You have successfully registered - Hope Orphanage', html: emailShell(body) });
};

// ── FUNCTION 2 — sendLoginEmail (UNCHANGED) ──
const sendLoginEmail = async (toEmail, name) => {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
  const body = `
    <h2 style="color:#4a90e2;margin-top:0;">Login Confirmed!</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Hello <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">You have successfully logged into the <strong>Hope Orphanage</strong> portal. Welcome back!</p>
    <div style="background:#eaf4ff;border-left:4px solid #4a90e2;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">Account: ${toEmail}<br/>Login Time: ${now}</p>
    </div>
    <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#7d6608;line-height:1.8;">Security Notice: If you did NOT log in just now, please change your password immediately.</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#4a90e2;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Open Dashboard</a>
    </div>
  `;
  await sendEmail({ from: `"Hope Orphanage" <${process.env.EMAIL_USER}>`, to: toEmail, subject: 'You have successfully logged in - Hope Orphanage', html: emailShell(body) });
};

// ── FUNCTION 3 — sendDonationEmail (MODIFIED) ──
// Now accepts donationType and visitDate for offline donations
const sendDonationEmail = async (toEmail, name, amount, donationType = 'Money', visitDate = null) => {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  // Format visit date nicely if provided
  const visitStr = visitDate
    ? new Date(visitDate).toLocaleDateString('en-IN', { dateStyle: 'full' })
    : 'To be confirmed';

  // Show amount row only for money donations
  const amountRow = (donationType === 'Money' && amount > 0)
    ? `Amount: ₹${Number(amount).toLocaleString('en-IN')}<br/>`
    : '';

  const body = `
    <h2 style="color:#27ae60;margin-top:0;">Donation Appointment Scheduled! 💰</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Dear <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">
      Thank you for your donation request. We appreciate your support.
      Your <strong>${donationType}</strong> donation appointment has been recorded.
    </p>
    <div style="background:#eafaf1;border-left:4px solid #27ae60;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">
        Donor: ${name}<br/>
        Donation Type: ${donationType}<br/>
        ${amountRow}
        Scheduled Visit: ${visitStr}<br/>
        Recorded on: ${now}<br/>
        Mode: Offline ✅
      </p>
    </div>
    <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#7d6608;line-height:1.8;">
        📍 Please visit <strong>Hope Orphanage</strong> on your scheduled date to complete the donation.<br/>
        Address: 12, MG Road, Koramangala, Bangalore – 560034
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#27ae60;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Visit Dashboard</a>
    </div>
  `;
  await sendEmail({ from: `"Hope Orphanage" <${process.env.EMAIL_USER}>`, to: toEmail, subject: 'Donation Appointment Confirmed - Hope Orphanage', html: emailShell(body) });
};

// ── FUNCTION 4 — sendApplicationEmail (UNCHANGED) ──
const sendApplicationEmail = async (toEmail, name, applicationType) => {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
  const body = `
    <h2 style="color:#8e44ad;margin-top:0;">Application Received! 📋</h2>
    <p style="font-size:15px;color:#333;line-height:1.8;">Dear <strong>${name}</strong>,</p>
    <p style="font-size:14px;color:#555;line-height:1.8;">Thank you for your ${applicationType.toLowerCase()} application. We will contact you soon.</p>
    <div style="background:#f5eef8;border-left:4px solid #8e44ad;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#2c3e50;line-height:1.9;">Applicant: ${name}<br/>Application Type: ${applicationType}<br/>Submitted on: ${now}<br/>Status: Pending Review 🔍</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="http://localhost:3000" style="background:#8e44ad;color:#fff;padding:12px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:bold;">Visit Dashboard</a>
    </div>
  `;
  await sendEmail({ from: `"Hope Orphanage" <${process.env.EMAIL_USER}>`, to: toEmail, subject: `Thank you for your ${applicationType} application - Hope Orphanage`, html: emailShell(body) });
};

// ── FUNCTION 5 — sendOtpEmail (UNCHANGED) ──
const sendOtpEmail = async (toEmail, otp) => {
  const body = `
    <h2 style="color:#2c3e50;margin-top:0;">Your Email Verification Code 🔑</h2>
    <p style="font-size:14px;color:#555;line-height:1.8;">You requested to verify your email address for a form submission on <strong>Hope Orphanage</strong>. Use the code below:</p>
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;background:#f0f4f8;border:2px dashed #4a90e2;border-radius:10px;padding:20px 40px;">
        <p style="margin:0;font-size:13px;color:#888;letter-spacing:1px;">YOUR OTP CODE</p>
        <p style="margin:8px 0 0;font-size:42px;font-weight:900;color:#2c3e50;letter-spacing:10px;font-family:monospace;">${otp}</p>
      </div>
    </div>
    <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:14px 18px;border-radius:5px;margin:22px 0;">
      <p style="margin:0;font-size:13px;color:#7d6608;line-height:1.8;">⏱️ <strong>This OTP expires in 10 minutes.</strong><br/>Do not share this code with anyone.</p>
    </div>
    <p style="font-size:13px;color:#aaa;">If you did not request this code, please ignore this email.</p>
  `;
  await sendEmail({ from: `"Hope Orphanage" <${process.env.EMAIL_USER}>`, to: toEmail, subject: 'Your OTP for Email Verification - Hope Orphanage', html: emailShell(body) });
};

module.exports = { sendRegistrationEmail, sendLoginEmail, sendDonationEmail, sendApplicationEmail, sendOtpEmail };
