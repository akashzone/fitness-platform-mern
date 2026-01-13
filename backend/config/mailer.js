const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
});

console.log("[SMTP] User exists:", !!process.env.SMTP_USER);
console.log("[SMTP] Password exists:", !!process.env.SMTP_PASS);

console.log(`Mailer initialized for user: ${process.env.SMTP_USER}`);
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Verify Error:', error);
    } else {
        console.log('SMTP Server is ready to take messages');
    }
});

const sendConfirmationEmail = async (userEmail, userName, productName) => {
    const mailOptions = {
        from: `"FitWithPravinn" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Thank You for Your Order - Program Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 10px;">
                <h2 style="color: #111; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Hi ${userName},</h2>
                <p>Thank you for choosing <strong>FitWithPravinn</strong>! Your enrollment in the <strong>${productName}</strong> has been confirmed.</p>
                
                <p>Our team will reach out to you within 24 hours to begin your transformation journey. We'll be setting up your personalized workout and diet plans shortly.</p>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Program:</strong> ${productName}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Status:</strong> Enrollment Confirmed</p>
                </div>

                <p>If you have any questions in the meantime, please feel free to reply to this email.</p>
                <br>
                <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                    <p style="margin-bottom: 5px;">Stay Disciplined,</p>
                    <p style="font-weight: bold; color: #22c55e; margin-top: 0;">FitWithPravinn Team</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email] Confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error(`[Email] Failed to send confirmation email to ${userEmail}:`, error.message);
    }
};

const sendEbookEmail = async (userEmail, userName, purchasedItems, orderId) => {
    const itemsList = purchasedItems
        .filter(item => item.type === 'ebook')
        .map(item => `
            <li style="margin-bottom: 10px; color: #22c55e; font-weight: bold;">
                ${item.title}
            </li>
        `).join('');

    const mailOptions = {
        from: `"FitWithPravinn" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'Thank You for Your Order - Digital Product Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 10px;">
                <h2 style="color: #111; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Hi ${userName},</h2>
                <p>Thank you for your purchase! Your payment for the following digital products has been confirmed:</p>
                
                <ul style="margin: 20px 0;">
                    ${itemsList}
                </ul>

                <p><strong>Note:</strong> Our team will manually deliver your PDF(s) to you shortly via WhatsApp or Email. Please keep an eye on your messages.</p>

                <p style="font-size: 14px; color: #666;">
                    <strong>Order Reference:</strong> ${orderId}<br>
                    If you have any questions, please reply to this email or contact our support team.
                </p>
                <br>
                <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                    <p style="margin-bottom: 5px;">Stay Disciplined,</p>
                    <p style="font-weight: bold; color: #22c55e; margin-top: 0;">FitWithPravinn Team</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email] Ebook email sent to ${userEmail}`);
    } catch (error) {
        console.error(`[Email] Failed to send ebook email to ${userEmail}:`, error.message);
    }
};

module.exports = { sendConfirmationEmail, sendEbookEmail };
