const nodemailer = require('nodemailer');

/**
 * Reusable email utility to send purchase confirmation emails.
 */
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
    });

    const mailOptions = {
        from: `"FitWithPravinn" <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: `Success! You're enrolled in ${options.productName}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #000; padding: 20px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">FitWithPravinn</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #22c55e;">Hi ${options.name},</h2>
                    <p>Congratulations! Your purchase for <strong>${options.productName}</strong> was successful.</p>
                    <p>We're excited to have you on board. Your payment has been confirmed and your access is being prepared.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
                        <p style="margin: 0; font-weight: bold;">Next Step:</p>
                        <p style="margin: 10px 0;">To help us get started with your personalized plan, please fill out our induction form below.</p>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="${process.env.GOOGLE_FORM_LINK}" style="background-color: #22c55e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Fill Induction Form</a>
                        </div>
                    </div>

                    <p>If you have any questions, feel free to reply to this email or reach out to us on WhatsApp.</p>
                    <p>Stay disciplined,</p>
                    <p style="font-weight: bold; color: #22c55e;">FitWithPravinn Team</p>
                </div>
                <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                    <p>&copy; ${new Date().getFullYear()} FitWithPravinn. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${options.email}`);
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
