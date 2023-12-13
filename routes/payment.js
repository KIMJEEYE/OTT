const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { isLoggedIn, isAdmin } = require('./helpers');


router.get('/', async (req, res, next) => {
  try {
    const paymentHistory = await Payment.findOne({
      attributes: ['paymentDate', 'paymentMethod', 'paymentAmount']
    });

    res.render('payment', {
      title: require('../package.json').name,
      port: process.env.PORT,
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 결제 요청
router.post('/', async (req, res) => {
 try {
    const paymentData = req.body;

    switch (paymentData.paymentOption) {
      case 'monthly':
        paymentData.paymentAmount = 5000;
        paymentData.paymentMethod = 'creditCard'; 
        break;
      case 'threeMonths':
        paymentData.paymentAmount = 13000;
        paymentData.paymentMethod = 'creditCard';
        break;
      case 'singleMovie':
        paymentData.paymentAmount = 15000;
        paymentData.paymentMethod = 'creditCard'; 
        break;
      default:
        paymentData.paymentAmount = 0;
        paymentData.paymentMethod = 'unknown'; 
    }

    
    paymentData.paymentDate = new Date();


    const payment = await Payment.create(paymentData);
    

    res.status(200).json({ message: '결제가 요청되었습니다.', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 결제 취소 요청
router.post('/payment/cancel', async (req, res) => {
  try {
    const paymentId = req.body.paymentId;
    const payment = await Payment.findByPk(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: '결제가 없습니다.' });
    }

    // 결제 취소 로직 구현
    await payment.update({ status: 'cancelled' });

    res.status(200).json({ message: '결제가 취소되었습니다.', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 결제 이력 조회
router.get('/payment/history', async (req, res) => {
  try {
    const paymentHistory = await Payment.findAll();
    res.status(200).json(paymentHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 환불 요청
router.post('/refund', async (req, res) => {
  try {
    const refundData = req.body;
    const refund = await Refund.create(refundData);
    res.status(200).json({ message: '환불이 요청되었습니다.', refund });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 환불 이력 조회
router.get('/refund/history', async (req, res) => {
  try {
    const refundHistory = await Refund.findAll();
    res.status(200).json(refundHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
