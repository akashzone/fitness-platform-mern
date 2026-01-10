const axios = require('axios');

const sendWhatsAppMessage = async (phone, userName, productName) => {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const messageData = {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
            body: `Hi ${userName},\n\nThank you for purchasing ${productName}.\n\nPlease fill this mandatory form:\n${process.env.GOOGLE_FORM_LINK}\n\nOnce done, you will receive your diet plan within 48 hours.`
        }
    };

    try {
        await axios.post(url, messageData, {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        console.log(`WhatsApp message sent to ${phone}`);
    } catch (error) {
        console.error('WhatsApp Error:', error.response?.data || error.message);
    }
};

module.exports = { sendWhatsAppMessage };
