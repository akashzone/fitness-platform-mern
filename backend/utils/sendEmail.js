const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send Transactional Purchase Confirmation Email via Resend
 */
const sendPurchaseConfirmationEmail = async ({
  to,
  name,
  courseName,
  months,
  amount,
  orderId,
}) => {
  console.log(`[Resend] Preparing to send email to: ${to}, Course: ${courseName}, Order: ${orderId}`);
  try {
    const { data, error } = await resend.emails.send({
      from: "FitWithPravinn <onboarding@fitwithpravinn.com>",
      to: [to],
      subject: "✅ Course Purchased Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Hi ${name},</h2>
          <p>Your purchase was <strong>successful</strong> 🎉</p>

          <h3>📦 Order Details</h3>
          <ul>
            <li><strong>Course:</strong> ${courseName}</li>
            <li><strong>Duration:</strong> ${months} month(s)</li>
            <li><strong>Amount Paid:</strong> ₹${amount}</li>
            <li><strong>Order ID:</strong> ${orderId}</li>
          </ul>

          <p>
            👉 Next step:  
            Click the WhatsApp button on the website to connect with the coach.
          </p>

          <br/>
          <p>Stay fit,<br/><strong>Team FitWithPravinn</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", JSON.stringify(error, null, 2));
      return;
    }

    console.log("✅ Resend email sent successfully to:", to);
  } catch (err) {
    console.error("❌ Resend SDK Exception:", err);
  }
};

module.exports = { sendPurchaseConfirmationEmail };
