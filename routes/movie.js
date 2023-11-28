// 영화 관련 라우터
const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');
const Movie = require('../models/Movie');

// 특정 장르에 속한 영화 목록 조회
router.get('/:genre_id/movies', async (req, res, next) => {
    try {
        const movies = await Movie.findAll({ where: { genre_id: req.params.genre_id } });
        res.json(movies);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 장르에 새로운 영화 등록
router.post('/:genre_id/movies', async (req, res, next) => {
    try {
        req.body.genre_id = req.params.genre_id;
        const movie = await Movie.create(req.body);
        res.json(movie);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 장르의 특정 영화 정보 수정
router.put('/:genre_id/movies/:movie_id', async (req, res, next) => {
    try {
        const movie = await Movie.findOne({ where: { id: req.params.movie_id, genre_id: req.params.genre_id } });
        if (movie) {
            movie.title = req.body.title;
            movie.content = req.body.content;
            await movie.save();
            res.json(movie);
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 장르의 특정 영화 삭제
router.delete('/:genre_id/movies/:movie_id', async (req, res, next) => {
    try {
        const result = await Movie.destroy({ where: { id: req.params.movie_id, genre_id: req.params.genre_id } });
        if (result) {
            res.status(200).send('Movie deleted');
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 장르의 특정 영화 상세 조회
router.get('/:genre_id/movies/:movie_id', async (req, res, next) => {
    try {
        const movie = await Movie.findOne({ where: { id: req.params.movie_id, genre_id: req.params.genre_id } });
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).send('Movie not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;