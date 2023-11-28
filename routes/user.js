// 회원 관리에 관련된 라우트를 처리
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../models/User');

const { logout } = require('./helpers');

const passport = require('passport');

router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'dateOfBirth', 'phoneNumber']
        });
        res.render('user', {
            title: require('../package.json').name,
            port: process.env.PORT,
            users: users.map(user => user.id)
        });
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
        const { username, password, email, dateOfBirth, phoneNumber } = req.body;
        const user = await User.findOne({ where: { username } });
        if (user) {
            next(new Error('이미 존재하는 사용자입니다.'));
            return;
        }

        try {
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                username,
                password: hash,
                email,
                dateOfBirth,
                phoneNumber
            });
            res.redirect('user/login');
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

router.get('/main', (req, res, next) => {
    try {
        res.render('main', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/read', async (req, res, next) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('필수 입력값이 없습니다.');
        }

        if (!req.isAuthenticated()) {
            return res.status(400).send('로그인 정보가 일치하지 않습니다.');
        }

        // 관리자일 경우 모든 사용자 정보 조회
        if (username === 'admin') {
            const users = await User.findAll({
                attributes: ['id', 'username', 'email', 'dateOfBirth', 'phoneNumber']
            });
            res.render('user', {
                title: require('../package.json').name,
                port: process.env.PORT,
                users: users.map(user => user.id)
            });
        } else {
            // 특정 사용자 정보 조회
            const user = await User.findOne({
                attributes: ['id', 'username', 'email', 'dateOfBirth', 'phoneNumber'],
                where: { username }
            });
            res.render('user', {
                title: require('../package.json').name,
                port: process.env.PORT,
                users: [user.id]
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/update', async (req, res, next) => {
    try {
        const result = await User.update({
            username: req.body.username,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber
        }, {
            where: { id: req.body.id }
        });
        if (result)
            res.redirect('/user');
        else next(new Error('업데이트에 실패했습니다.'));
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/delete', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.body.id }
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
