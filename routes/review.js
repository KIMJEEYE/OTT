// 리뷰 관리에 관련된 라우트를 처리

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const passport = require('passport');


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

// 리뷰 작성
router.post('/create', async (req, res, next) => {
    try {
        const review = await Review.create(req.body);
        // 리뷰 작성 후 영화의 평점 업데이트
        await Movie.updateRating(req.body.MovieId);
        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 상세 조회
router.get('/:review_id', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            res.json(review);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 수정
router.put('/:review_id', async (req, res, next) => {
    try {
        const updatedReview = await Review.update(req.body, {
            where: { id: req.params.review_id },
            returning: true,
        });

        if (updatedReview && updatedReview[0] > 0) {
            const updatedReviewInstance = updatedReview[1][0];

            await Movie.updateRating(updatedReviewInstance.MovieId);

            res.json(updatedReviewInstance);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 삭제
router.delete('/:review_id', async (req, res, next) => {
    try {
        const deletedReview = await Review.findOne({ where: { id: req.params.review_id } });
        if (!deletedReview) {
            return res.status(404).send('Review not found');
        }

        // 리뷰 삭제 전 해당 리뷰의 MovieId를 저장해둠
        const movieId = deletedReview.MovieId;

        // 리뷰 삭제
        await deletedReview.destroy();

        // 리뷰 삭제 후 영화의 평점 업데이트
        await Movie.updateRating(movieId);

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
