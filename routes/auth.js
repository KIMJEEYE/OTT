const express = require('express');
const passport = require('passport');

const { logout } = require('./helpers');

const router = express.Router();


router.post('/login', (req, res, next) => {
    // passport.authenticate 미들웨어: 로컬 로그인 전략 수행
    // 라우터 미들웨어 안에 미들웨어 있는 구조
    passport.authenticate('local', (authError, user, info) => {
        if (user) req.login(user, loginError => res.render('../views/main'));
        else next(info);
    })(req, res, next);
});

router.get('/logout', logout);

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/' }),
    (req, res) => res.render('../views/main')
);

module.exports = router;

