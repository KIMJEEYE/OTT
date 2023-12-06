// 영화 관련 라우터
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const models = require('../models');


// 모든 영화 목록 조회
router.route('/')
    .get(async (req, res, next) => {
        try {
            const movies = await Movie.findAll({
                attributes: ['id', 'title', 'director', 'year', 'synopsis', 'rating'],
                include: [{ model: Genre, as: 'Genres', through: models.MovieGenre }]
            });
            res.render('movie', {
                title: require('../package.json').name,
                port: process.env.PORT,
                movies: movies
            });
        }
        catch (err) {
            console.error(err);
            next(err);
        }
    });

// 특정 장르에 속한 영화 목록 조회
router.get('/genres/movie', async (req, res, next) => {
    if (!req.query.genre) {
        return res.status(400).send('장르 값이 없습니다.');
    }
    try {
        const genre = await Genre.findOne({ where: { name: req.query.genre } });
        if (!genre) {
            return res.status(404).send('해당 장르를 찾지 못했습니다.');
        }

        const movies = await Movie.findAll({ include: [{ model: Genre, as: 'Genres', where: { name: req.query.genre } }] });
        res.json(movies);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// TOP 10 영화 조회
router.get('/top', async (req, res) => {
    try {
        const movies = await Movie.findAll({ order: [['rating', 'DESC']], limit: 10 });
        res.send(movies);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 최신 영화 조회
router.get('/new', async (req, res) => {
    try {
        const movies = await Movie.findAll({ order: [['year', 'DESC']], limit: 10 });
        res.send(movies);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 영화 상세 정보 조회
router.get('/:movie_id', async (req, res, next) => {
    try {
        const movie = await Movie.findOne({
            where: { id: req.params.movie_id },
            include: [{ model: Genre, as: 'Genres' }]
        });
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).send('영화를 찾지 못했습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
