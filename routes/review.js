// 리뷰 관리에 관련된 라우트를 처리
// 별 관리, 나라별 탑 10 저장, 사용자에 맞게 자동추천해줌
// 리뷰 작성, 수정, 삭제, 조회, 좋아요, 싫어요, 신고, 댓글 작성, 수정, 삭제, 조회

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const passport = require('passport');

// 리뷰 작성
router.post('/', async (req, res, next) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const reviews = await Review.findAll();
        res.json(reviews);
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
        const review = await Review.update({ name: req.body.name }, { where: { id: req.params.review_id } });
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

// 리뷰 삭제
router.delete('/:review_id', async (req, res, next) => {
    try {
        const result = await Review.destroy({ where: { id: req.params.review_id } });
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 좋아요
router.post('/:review_id/like', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            review.likes += 1;
            await review.save();
            res.json(review);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 싫어요
router.post('/:review_id/dislike', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            review.dislikes += 1;
            await review.save();
            res.json(review);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 리뷰 신고
router.post('/:review_id/report', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            review.reports += 1;
            await review.save();
            res.json(review);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 댓글 작성
router.post('/:review_id/comments', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            const comment = await Comment.create(req.body);
            review.comments.push(comment);
            await review.save();
            res.status(201).json(comment);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 댓글 수정
router.put('/:review_id/comments/:comment_id', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            const comment = await Comment.findOne({ where: { id: req.params.comment_id } });
            if (comment) {
                comment.text = req.body.text;
                await comment.save();
                res.json(comment);
            } else {
                res.status(404).send('Comment not found');
            }
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 댓글 삭제
router.delete('/:review_id/comments/:comment_id', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            const comment = await Comment.findOne({ where: { id: req.params.comment_id } });
            if (comment) {
                await comment.destroy();
                res.json({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).send('Comment not found');
            }
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 댓글 조회
router.get('/:review_id/comments', async (req, res, next) => {
    try {
        const review = await Review.findOne({ where: { id: req.params.review_id } });
        if (review) {
            const comments = await Comment.findAll({ where: { reviewId: review.id } });
            res.json(comments);
        } else {
            res.status(404).send('Review not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
