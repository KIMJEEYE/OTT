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

// 해당 유저에게만 해당하는 할인 정보 조회
router.get('/', async (req, res, next) => {
    try {
        // 유저에게 할당된 할인 정보 조회하는 로직
        const discounts = await Discount.findAll();
        res.json(discounts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;