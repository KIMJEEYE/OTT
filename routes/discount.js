// 할인 관리에 관련된 라우트를 처리
// 제휴 할인 등 결제 시 확인할 수 있게 함
// (추후에 좀 비면 동적 할인 적용 및 프로모션 지원하는 기능도 여기에 추가하면 좋을 듯) 
// 할인 정보 조회: GET /
// 특정 할인 정보 조회: GET /:discount_id
// 새로운 할인 등록: POST /
// 특정 할인 정보 수정: PUT /:discount_id
// 특정 할인 정보 삭제: DELETE /:discount_id

const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const passport = require('passport');

router.get('/', async (req, res, next) => {
    try {
        const discounts = await Discount.findAll();
        res.json(discounts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/:discount_id', async (req, res, next) => {
    try {
        const discount = await Discount.findOne({ where: { id: req.params.discount_id } });
        if (discount) {
            res.json(discount);
        } else {
            res.status(404).send('Discount not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const discount = await Discount.create(req.body);
        res.status(201).json(discount);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.put('/:discount_id', async (req, res, next) => {
    try {
        const discount = await Discount.update({ name: req.body.name }, { where: { id: req.params.discount_id } });
        if (discount) {
            res.json(discount);
        } else {
            res.status(404).send('Discount not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:discount_id', async (req, res, next) => {
    try {
        const result = await Discount.destroy({ where: { id: req.params.discount_id } });
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;