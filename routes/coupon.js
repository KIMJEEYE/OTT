const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const passport = require('passport');

router.post('/',async (req,res,next)=>{
    try{
        const coupon = await Coupon.findAll({
            attributes:['name','discountRate','discountPeriod'],
            include:[{model:User,as:'Users',through:models.UserCoupon}]
        });
        res.render('coupon',{
            title: require('../package.json').name,
            port: process.env.PORT,
            coupon:coupon
        });
    } catch(err){
        console.error(err);
        next(err);
    }
});

// 해당 유저에게만 해당하는 할인 정보 조회
router.get('/:userId', async (req, res, next) => {
    try {
        // 유저에게 할당된 할인 정보 조회하는 로직
        const coupons = await Coupon.findAll();
        res.json(coupons);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/* 
    #############################################################################################
    admin 관련 라우터
*/

// 새로운 할인 등록
router.post('/', async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 할인 정보 수정
router.put('/:coupon_id', async (req, res, next) => {
    try {
        const coupon = await Coupon.update({ name: req.body.name }, { where: { id: req.params.coupon_id } });
        if (coupon) {
            res.json(coupon);
        } else {
            res.status(404).send('Coupon not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 할인 정보 삭제
router.delete('/:coupon_id', async (req, res, next) => {
    try {
        const result = await Coupon.destroy({ where: { id: req.params.coupon_id } });
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;