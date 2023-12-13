const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { isLoggedIn } = require('./helpers');


router.get('/', async (req, res, next) => {
  try {
    const payments = await Payment.findOne({
      attributes: ['id', 'paymentDate', 'paymentMethod', 'paymentAmount']
    });

    res.render('payment', {
      title: require('../package.json').name,
      port: process.env.PORT,
      payments: payments
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
});


// 결제 요청
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const paymentData = req.body;
    paymentData.userId = req.user.userId;

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
    
    const payment = await Payment.create({
      ...paymentData,
      userId: req.user.userId, 
  });
    await payment.update({ status: 'approved' });

    res.status(200).json({ message: '결제가 요청되었습니다.', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 결제 내역 조회
router.get('/history', isLoggedIn, async (req, res, next) => {
  try {
    // isLoggedIn 미들웨어로부터 로그인된 사용자의 userId를 받아옴
    const userId = req.user.userId;

    // 결제 내역을 해당 사용자의 userId로 조회
    const payments = await Payment.findAll({
      attributes: ['id','paymentDate', 'paymentMethod', 'paymentAmount','status'], // 필요한 컬럼만 선택
      where: { userId: userId }
    });

    res.json({ payments: payments });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


// 결제 취소 요청
router.post('/cancel', isLoggedIn, async (req, res) => {
  try {
    const cancelPayment = await Payment.update({
      status: 'cancelled'
    }, {
      where: { id: req.body.id }
    });
    
    res.status(201).json({ message: '결제가 취소되었습니다.', cancelPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});


// 결제 환불 요청
router.post('/refund', isLoggedIn, async (req, res) => {
  try {
    const refundPayment = await Payment.update({
      status: 'refunded'
    }, {
      where: { id: req.body.id }
    });
    
    res.status(201).json({ message: '결제가 환불되었습니다.', refundPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});
module.exports = router;
