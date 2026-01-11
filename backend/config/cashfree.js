const { Cashfree } = require("cashfree-pg");
require("dotenv").config();

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;

// ✅ REQUIRED for TEST keys
Cashfree.XEnvironment = "SANDBOX";

console.log(
    "[Cashfree] Configured with AppID:",
    process.env.CASHFREE_APP_ID?.slice(0, 10) + "..."
);
console.log(
    "[Cashfree] Base URL set to: https://sandbox.cashfree.com/pg"
);

module.exports = Cashfree;
