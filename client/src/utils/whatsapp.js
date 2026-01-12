/**
 * Generates a WhatsApp Click-to-Chat link with a professional pre-filled message.
 * 
 * @param {Object} user - User object containing name and email.
 * @param {Object} program - Program object containing the title/name.
 * @returns {string} - The encoded WhatsApp URL.
 */
export const generateWhatsAppLink = (user, program) => {
    const adminNumber = "917304388524";
    const userName = user?.name || "[Your Name]";
    const userEmail = user?.email || "[Your Email]";
    const programName = program?.title || program?.name || "the fitness program";

    const message = `Hello,
I have successfully completed my payment for the ${programName}${program?.selectedDuration ? ` (${program.selectedDuration} Months Program)` : ''}.

Name: ${userName}
Email: ${userEmail}

Please let me know the next steps.
Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${adminNumber}?text=${encodedMessage}`;
};
