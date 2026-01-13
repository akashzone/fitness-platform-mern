const express = require('express');
const router = express.Router();
const { createCashfreeOrder, verifyCashfreeOrder, cashfreeWebhook } = require('../controllers/cashfreeController');

router.post('/create-order', createCashfreeOrder);
router.get('/verify/:orderId', verifyCashfreeOrder);
router.post('/webhook', cashfreeWebhook);

module.exports = router;
