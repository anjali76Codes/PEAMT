// utils/emailSender.js
import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Change this to your email service if needed
        auth: {
            user: process.env.EMAIL_USER, // Your email address from .env
            pass: process.env.EMAIL_PASS,  // Usually, this is still needed for Gmail
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
