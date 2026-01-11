const express = require('express');
const router = express.Router();
const { createCashfreeOrder, cashfreeWebhook } = require('../controllers/cashfreeController');

router.post('/create-order', createCashfreeOrder);
router.post('/webhook', cashfreeWebhook);

module.exports = router;
