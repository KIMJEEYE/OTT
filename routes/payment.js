// routes/paymentRoutes.js
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const tossApiKey = process.env.TOSS_Client_ID;

// 결제 생성
router.post('/create', async (req, res) => {
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tossApiKey}`,
      },
      body: JSON.stringify({
        orderId: req.body.orderId || 'YOUR_ORDER_ID',
        amount: req.body.amount || 10000,
        customerKey: 'CUSTOMER_KEY',
        returnUrl: 'http://localhost:3003/payment/success',
        cancelUrl: 'http://localhost:3003/payment/cancel',
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 결제 승인
router.post('/confirm', async (req, res) => {
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tossApiKey}`,
      },
      body: JSON.stringify({
        paymentKey: req.body.paymentKey || 'PAYMENT_KEY_FROM_CREATE',
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 결제 취소
router.post('/cancel', async (req, res) => {
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tossApiKey}`,
      },
      body: JSON.stringify({
        paymentKey: req.body.paymentKey || 'PAYMENT_KEY_TO_BE_CANCELED',
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 결제 환불
router.post('/refund', async (req, res) => {
  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tossApiKey}`,
      },
      body: JSON.stringify({
        paymentKey: req.body.paymentKey || 'PAYMENT_KEY_TO_BE_REFUNDED',
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
