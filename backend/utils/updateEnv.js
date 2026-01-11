const fs = require('fs');
const path = require('path');

const envContent = `PORT=5000
MONGODB_URI=mongodb+srv://fitnessAdmin:fitwithpravinn@fitness-cluster.teocazc.mongodb.net/?appName=fitness-cluster
CASHFREE_APP_ID=TEST109554441e82bdc370d81cf6de444445590
CASHFREE_SECRET_KEY=${process.env.CASHFREE_SECRET_KEY}
CASHFREE_ENV=TEST
BACKEND_URL=https://fitness-platform-mern.onrender.com
FRONTEND_URL=https://fitwithpravinn.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=akashnadar.dev@gmail.com
SMTP_PASS=rlyvrjlrgdvdtdpp
GOOGLE_FORM_LINK=https://docs.google.com/forms/d/e/1FAIpQLSfB2jU89S_N-eR4v67C_jVzO14M5t_Fp8W_T9p-Q3r7_r0j_g/viewform?usp=sf_link
`;

fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);
console.log('.env updated successfully with correct DB URI');
