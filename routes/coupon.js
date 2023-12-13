const express = require('express');
const router = express.Router();
const { isAdmin } = require('./helpers'); 
const { User, Coupon, UserCoupon } = require('../models'); 

router.get('/', isAdmin, async (req, res, next) => {
    try {
        const coupons = await Coupon.findAll({
            attributes: ['id', 'name', 'discountRate', 'discountPeriod'],
        });

        res.render('coupon', {
            title: require('../package.json').name,
            port: process.env.PORT,
            coupons: coupons
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 쿠폰 등록
router.post('/', isAdmin, async (req, res, next) => {
    try {
        const { userId, couponName } = req.body;

        // 사용자 아이디로 사용자를 찾음
        const user = await User.findOne({ where: { userId } });

        // 사용자가 존재하지 않으면 에러 응답
        if (!user) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 쿠폰 이름으로 쿠폰을 찾음
        const existingCoupon = await Coupon.findOne({
            where: { name: couponName }
        });

        // 쿠폰이 존재하지 않으면 에러 응답
        if (!existingCoupon) {
            return res.status(404).json({ error: '존재하지 않는 쿠폰입니다.' });
        }

        // 찾은 쿠폰에 userId를 추가
        await existingCoupon.update({ userId: user.userId }, { fields: ['userId'] });

        res.status(201).json({ message: '쿠폰이 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;
