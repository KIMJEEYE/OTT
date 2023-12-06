// 회원 관리에 관련된 라우트를 처리
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { isLoggedIn, logout } = require('./helpers');

const passport = require('passport');

// routes/user.js 파일에서 /user 엔드포인트를 처리하는 부분
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        // 현재 로그인된 사용자의 정보만 조회
        const user = await User.findOne({
            attributes: ['userId', 'username','email', 'dateOfBirth', 'phoneNumber'],
            where: { userId: req.user.userId }
        });
        res.render('user', { user: user });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

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
        const user = await User.findOne({ where: { userId } });
        if (user) {
            next(new Error('이미 존재하는 사용자입니다.'));
            return;
        }

        try {
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
        }

        catch (err) {
            console.error(err);
            next(err);
        }
    });

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
    }), (req, res, next) => {
        res.render('main');
    });

router.get('/user/read', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({
            attributes: ['username', 'email', 'dateOfBirth', 'phoneNumber'],
            where: { userId: req.user.userId }
        });
        res.render('user', { user: user });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update', isLoggedIn, async (req, res, next) => {
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
        if (result)
            res.redirect('/user');
        else next(new Error('업데이트에 실패했습니다.'));
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/delete', isLoggedIn, async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { userId: req.user.userId }
        });
        if (result)
            res.redirect('/user');
        else next(new Error('삭제에 실패했습니다.'));
    } catch (err) {
        console.error(err);
        next(err);
    }
}, logout);

module.exports = router;
