exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        // 사용자가 로그인한 경우에는 사용자 정보를 전달
        res.locals.user = req.user;

        // 사용자가 관리자인 경우에는 isAdmin을 true로 설정
        res.locals.isAdmin = req.user.userId === 'admin';

        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/`);
    }
};

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};


exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.userId === 'admin') {
        next(); // 관리자라면 다음 미들웨어로 이동
    } else {
        res.status(403).send('관리자만 접근 가능합니다.');
    }
};