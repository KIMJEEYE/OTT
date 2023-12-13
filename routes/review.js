const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { isLoggedIn } = require('./helpers');

// 리뷰 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const reviews = await Review.findAll();
        res.render('review', {
            title: require('../package.json').name,
            port: process.env.PORT,
            reviews: reviews
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

const processRating = async (title, reviewStar, content, user, method) => {
    try {
        // 사용자 정보 가져오기
        const userId = user ? user.userId : null;

        // 영화 제목으로 영화를 찾아서 ID를 가져옴
        const movie = await Movie.findOne({ where: { title: title } });

        if (!movie) {
            throw new Error('해당 영화를 찾을 수 없습니다.');
        }


        // Review 생성 또는 수정 시 movieId와 userId를 지정
        const [review, created] = await Review.findOrCreate({
            where: { title: title, userId: userId },
            defaults: {
                movieId: movie.id,
                rating: reviewStar,
                content: content,
            },
        });

        if (!created) {
            const updatedRows = await Review.update({
                movieId: movie.id,
                rating: reviewStar,
                content: content,
            }, {
                where: { title: title, userId: userId }
            });

            if (updatedRows[0] > 0) {
                const updatedReview = await Review.findOne({ where: { title: title, userId: userId } });
                return updatedReview;
            } else {
                throw new Error('업데이트에 실패했습니다.');
            }


            return review;
        }
        // 리뷰 작성 후 영화의 평점 업데이트
        await Movie.updateRating(movie.id);
    } catch (err) {
        console.error(err);
        throw err;
    }
};


// 리뷰 작성 라우트
router.post('/create', isLoggedIn, async (req, res, next) => {
    try {
        // 영화 제목이 없을 경우 에러 응답
        if (!req.body.title) {
            return res.status(400).send('요청 본문에 영화 제목이 누락되었습니다.');
        }

        // 클라이언트에서 전송된 별점 값 확인
        const reviewStar = req.body.reviewStar;

        // 별점이 없을 경우 에러 응답
        if (!reviewStar) {
            return res.status(400).send('요청 본문에 별점이 누락되었습니다.');
        }

        const review = await processRating(
            req.body.title,
            req.body.reviewStar,
            req.body.content,
            req.user,

        );

        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 목록 조회
router.get('/reviews', isLoggedIn, async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { userId: req.user.userId }
        });
        res.render('reviews', { reviews: reviews });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 수정
router.post('/update', isLoggedIn, async (req, res, next) => {
    try {
        const updatedReviewData = await processRating(
            req.body.title,
            req.body.reviewStar,
            req.body.content,
            req.user,
        );
        res.status(200).json(updatedReviewData);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 삭제
router.post('/delete', isLoggedIn, async (req, res, next) => {
    try {
        const { title } = req.body;
        const deletedReview = await Review.findOne({ where: { title: title } });

        // 리뷰 삭제
        await deletedReview.destroy();

        // 영화 평점 업데이트
        await Movie.updateRating(deletedReview.movieId);

        res.json({ message: '리뷰가 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;