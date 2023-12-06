// 장르에 관련된 라우터 처리
const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');
const Movie = require('../models/Movie');

// Index
router.get('/', async (req, res, next) => {
    try {
        const genres = await Genre.findAll();
        res.json(genres);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르를 목록으로 조회: GET movie/genre
router.get('/genre', async (req, res, next) => {
    try {
        const movies = await Movie.findAll({ include: [{ model: Genre, as: 'Genres' }] });
        const genres = movies.reduce((acc, cur) => {
            acc.push(...cur.Genres.map(genre => genre.name));
            return acc;
        }, []);
        const uniqueGenres = Array.from(new Set(genres));
        res.json({genres: uniqueGenres});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르의 수 조회: GET movie/genre/count
router.get('/genre/count', async (req, res, next) => {
    try {
        const movies = await Movie.findAll({ include: [{ model: Genre, as: 'Genres' }] });
        const genres = movies.reduce((acc, cur) => {
            acc.push(...cur.Genres.map(genre => genre.name));
            return acc;
        }, []);
        const uniqueGenres = Array.from(new Set(genres));
        res.json({genres: uniqueGenres.length});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;