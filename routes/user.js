const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Coupon = require('../models/Coupon');

const User = require('../models/User');
const { isLoggedIn, logout, isAdmin } = require('./helpers');

// 로그인한 사용자 정보 조회
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            attributes: ['userId', 'username', 'email', 'dateOfBirth', 'phoneNumber'],
            where: { userId: req.user.userId }
        });

        // isAdmin을 true로 설정
        res.locals.isAdmin = req.user.userId === 'admin';

        if (res.locals.isAdmin) {
            // 모든 사용자 정보를 가져옴
            const users = await User.findAll({
                attributes: ['userId', 'username', 'email', 'dateOfBirth', 'phoneNumber']
            });

            res.render('user', { user, users });
        } else {
            // 관리자가 아닌 경우에는 사용자 정보만 전달
            res.render('user', { user });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원가입
router.route('/signup')
    .get(async (req, res, next) => {
        try {
            res.render('signup', {
                title: require('../package.json').name,
                port: process.env.PORT
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const { userId, password, username, email, dateOfBirth, phoneNumber } = req.body;
        try {
            const user = await User.findOne({ where: { userId } });
            if (user) {
                throw new Error('이미 존재하는 사용자입니다.');
            }

            const hash = await bcrypt.hash(password, 12);
            await User.create({
                userId,
                password: hash,
                username,
                email,
                dateOfBirth,
                phoneNumber
            });
            res.redirect('/user/login');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 로그인
router.route('/login')
    .get(async (req, res, next) => {
        try {
            res.render('login', {
                title: require('../package.json').name,
                port: process.env.PORT
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/user/login',
    }), (req, res) => {
        res.render('main', { ...{ redirect: '/user/main' }, ...{ port: process.env.PORT } });
    });

// 사용자 정보 수정
router.put('/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const newPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const result = await User.update({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber
        }, {
            where: { userId: req.user.userId }
        });

        if (result) {
            res.redirect('/user');
        } else {
            throw new Error('업데이트에 실패했습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 사용자 삭제
router.delete('/:userId', isLoggedIn, async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { userId: req.user.userId }
        });
        if (result) {
            res.redirect('/');
        } else {
            throw new Error('삭제에 실패했습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}, logout);

// 모든 사용자 정보 조회 (관리자만 접근 가능)
router.get('/all', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        const allUsers = await User.findAll({
            attributes: ['userId', 'username', 'email', 'dateOfBirth', 'phoneNumber'],
        });
        res.render('allUsers', { users: allUsers });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 쿠폰 조회
router.get('/coupon', isLoggedIn, async (req, res, next) => {
    try {
        const coupons = await Coupon.findAll({
            attributes: ['name', 'discountRate', 'discountPeriod'],
            where: { userId: req.user.userId }
        });

        res.json(coupons);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;
