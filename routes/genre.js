// 장르에 관련된 라우터 처리
const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('./helpers');
const Genre = require('../models/Genre');
const Movie = require('../models/Movie');

router.get('/', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        const genres = await Genre.findAll({
            include: [{ model: Movie, as: 'Movies' }]
        
        });
        res.render('genre', {
            title: require('../package.json').name,
            port: process.env.PORT,
            genres: genres
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르를 목록으로 조회
router.get('/genre', isLoggedIn, isAdmin, async (req, res, next) => {
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

// OTT에 등록된 장르의 수 조회
router.get('/genre/count', isLoggedIn, isAdmin, async (req, res, next) => {
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

// OTT에 장르 등록
router.post('/genre', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르 수정
router.put('/genre/:genre_id', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        const genre = await Genre.update({ name: req.body.name }, { where: { id: req.params.genre_id } });
        res.json(genre);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르 삭제
router.delete('/genre/:genre_id', isLoggedIn, isAdmin, async (req, res, next) => {
    try {
        await Genre.destroy({ where: { id: req.params.genre_id } });
        res.send('ok');
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;