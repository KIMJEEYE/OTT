// app
const path = require('path');

const dotenv = require('dotenv');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');

const nunjucks = require('nunjucks');
const sequelize = require('./models').sequelize;
const models = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');

const contentRouter = require('./routes/content');
const couponRouter = require('./routes/coupon');
const prodncoRouter = require('./routes/prodnCo');
const movieRouter = require('./routes/movie');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');
const authRouter = require('./routes/auth');
const reviewRouter = require('./routes/review');
dotenv.config();
passportConfig(passport);


const app = express();
app.set('port', process.env.PORT || 3003);

app.set('models', models);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, '/views'), {
    express: app,
    watch: false,
    autoescape: true
});

// 시퀄라이즈로 연결
sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error(err));

app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    }),
    methodOverride('_method')
);

// passport.initialize(): req 객체에 passport 설정 심음
app.use(passport.initialize());
// passport.session(): req.ssession 객체에 passport 정보 저장
app.use(passport.session());

// 라우팅
app.use('/content', contentRouter);
app.use('/coupon', couponRouter);
app.use('/prodnco', prodncoRouter);
app.use('/movie', movieRouter);
app.use('/payment', paymentRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/review', reviewRouter);
// app.use('/genre', genreRouter);

app.use((req, res) =>
    res.render('index', {
        title: require('./package.json').name,
        port: app.get('port'),
        user: req.user
    }));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});