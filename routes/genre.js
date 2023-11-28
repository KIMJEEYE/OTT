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
    Movie.find({})
    .sort({ createAt: -1 })
    .exec((err, movies) => {
        if (err) return res.status(500).send({error: 'database failure'});
        const genres = moive.reduce((acc, cur) => {
            acc.push(...moive.genres);
            return acc;
        }, []);
        const uniqueGenres = Array.from(new Set(genres));
        res.json({genres:uniqueGenres});
    });
});

// OTT에 등록된 장르의 수 조회: GET movie/genre/count
router.get('/genre/count', async (req, res, next) => {
    Movie.find({})
    .sort({ createAt: -1 })
    .exec((err, movies) => {
        if (err) return res.status(500).send({error: 'database failure'});
        const genres = moive.reduce((acc, cur) => {
            acc.push(...moive.genres);
            return acc;
        }, []);
        const uniqueGenres = Array.from(new Set(genres));
        res.json({genres:uniqueGenres.length});
    });
});

// OTT에 장르 등록: POST movie/genre
router.post('/genre', async (req, res, next) => {
    try {
        const genre = await Genre.create(req.body);
        res.status(201).json(genre);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르 수정: PUT movie/genre/:genre_id
router.put('/genre/:genre_id', async (req, res, next) => {
    try {
        const genre = await Genre.update({ name: req.body.name }, { where: { id: req.params.genre_id } });
        res.json(genre);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// OTT에 등록된 장르 삭제: DELETE movie/genre/:genre_id
router.delete('/genre/:genre_id', async (req, res, next) => {
    try {
        await Genre.destroy({ where: { id: req.params.genre_id } });
        res.send('ok');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;