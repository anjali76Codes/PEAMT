import nodemailer from 'nodemailer';

export const sendScorecard = async (req, res) => {
    const { email, results } = req.body;

    // Configure your email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or any other service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Exam Scorecard',
        text: 'Here is your scorecard.',
        attachments: [
            {
                filename: 'scorecard.json',
                content: JSON.stringify(results, null, 2),
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send email', error });
    }
};
