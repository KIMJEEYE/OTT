// 결제 처리에 관련된 라우트를 처리
// 사용자의 결제 방법 목록 조회: /methods
// 사용자의 결제 방법 등록: /methods
// 사용자의 결제 방법 삭제: /methods/:methodsId
// 사용자의 결제 방법 수정: /methods/:methodsId
// 웹 결제 혹은 연결제 선택 위한 옵션 설정: /users/userId/subscription
// 사용자가 선택한 구독 옵션 확인: /users/userId/subscription
// 사용자의 구독 옵션 선택 및 수정: /users/userId/subscription
// 결제 진행: execute
// 결제 취소: cancel
// 결제 환불: refund
// 결제 상세 조회: /:paymentId
// 결제 목록 조회: /
// 결제 요청: request
// 결제 승인: approve

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const passport = require('passport');

// 사용자의 결제 방법 목록 조회
router.get('/methods', async (req, res, next) => {
    try {
        const payments = await Payment.findAll();
        res.json(payments);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 사용자의 결제 방법 등록
router.post('/methods', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 사용자의 결제 방법 삭제
router.delete('/methods/:methodsId', async (req, res, next) => {
    try {
        const result = await Payment.destroy({ where: { id: req.params.methodsId } });
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 사용자의 결제 방법 수정
router.put('/methods/:methodsId', async (req, res, next) => {
    try {
        const payment = await Payment.update({ name: req.body.name }, { where: { id: req.params.methodsId } });
        res.json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 웹 결제 혹은 연결제 선택 위한 옵션 설정
router.post('/users/:userId/subscription', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 사용자가 선택한 구독 옵션 확인
router.get('/users/:userId/subscription', async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ where: { id: req.params.userId } });
        res.json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 사용자의 구독 옵션 선택 및 수정
router.put('/users/:userId/subscription', async (req, res, next) => {
    try {
        const payment = await Payment.update({ name: req.body.name }, { where: { id: req.params.userId } });
        res.json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 진행
router.post('/execute', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 취소
router.post('/cancel', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 환불
router.post('/refund', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 상세 조회
router.get('/:paymentId', async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ where: { id: req.params.paymentId } });
        res.json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const payments = await Payment.findAll();
        res.json(payments);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 요청
router.post('/request', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 결제 승인
router.post('/approve', async (req, res, next) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
