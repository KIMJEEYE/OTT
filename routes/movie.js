// 영화 관련 라우터
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Genre = require('../models/Genre');
const MovieGenre = require('../models/MovieGenre');
const models = require('../models');
const { isLoggedIn, isAdmin } = require('./helpers');


// 모든 영화 목록 조회
router.route('/')
    .get(async (req, res, next) => {
        try {
            const movies = await Movie.findAll({
                attributes: ['id', 'title', 'director', 'year', 'synopsis', 'rating'],
                include: [{ model: Genre, as: 'Genres', through: models.MovieGenre }]
            });
            res.locals.isAdmin = req.user.userId === 'admin';

            if (res.locals.isAdmin) {
                const movies = await Movie.findAll({
                    attributes: ['title', 'director', 'year', 'synopsis', 'rating'],
                    include: [{ model: Genre, through: MovieGenre }]
                });
                const genres = await Genre.findAll();
                res.render('movie', { movies, genres });
            } else {
                res.render('movie', {
                    title: require('../package.json').name,
                    port: process.env.PORT,
                    movies: movies,
                });
            }
        } catch (err) {
            console.error(err);
            next(err);
        }

    });

// 특정 장르에 속한 영화 목록 조회
router.get('/genres/movie', async (req, res, next) => {
    if (!req.query.genre_name) {
        return res.status(400).send('장르 값이 없습니다.');
    }
    try {
        const genre = await Genre.findOne({ where: { name: req.query.genre_name } });
        if (!genre) {
            return res.status(404).send('해당 장르를 찾지 못했습니다.');
        }

        const movies = await Movie.findAll({ include: [{ model: Genre, as: 'Genres', where: { name: req.query.genre_name } }] });
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
router.get('/', async (req, res, next) => {
    try {
        const movie = await Movie.findOne({
            where: { id: req.query.movie_id },
            include: [{ model: Genre, as: 'Genres' }]
        });

        if (movie) {
            res.render('movie', { movie });
        } else {
            res.status(404).send('영화를 찾지 못했습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});




/* 
    #############################################################################################
    admin 관련 라우터
*/

router.use("/admin*", isLoggedIn, isAdmin);

// 영화 등록 (관리자 전용)
router.post('/admin/movie', async (req, res, next) => {
    try {
        const { title, director, year, synopsis } = req.body;
        const genreName = req.body.genreName;

        const genre = await Genre.findOne({ where: { name: genreName } });
        if (!genre) {
            return res.status(404).json({ error: '해당 장르를 찾지 못했습니다.' });
        }

        const movie = await Movie.create({
            title,
            director,
            year,
            synopsis,
        });

        if (!movie) {
            return res.status(500).json({ error: '영화를 등록하는 중에 문제가 발생했습니다.' });
        }

        await MovieGenre.create({
            movieId: movie.id,
            genreName: genre.name,
        });

        res.status(201).send('영화를 등록했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
});



// 특정 장르의 특정 영화 정보 수정
router.put('/admin/genres/:genre_name/movies/:movie_id', async (req, res, next) => {
    try {
        const { genre_name, movie_id } = req.params;
        const movie = await Movie.findOne({ where: { id: movie_id } });

        if (movie) {
            // 영화 정보 수정
            movie.title = req.body.title;
            movie.director = req.body.director;
            movie.year = req.body.year;
            movie.synopsis = req.body.synopsis;

            await movie.save();

            res.json(movie);
            res.send(movie_id + '영화를 ' + genre_name + ' 장르에 수정했습니다.');
        } else {
            res.status(404).send('영화를 찾지 못했습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 장르의 특정 영화 삭제
router.delete('/admin/genres/:genre_name/movies/:movie_id', async (req, res, next) => {
    try {
        const { genre_name, movie_id } = req.params;
        const result = await Movie.destroy({ where: { id: movie_id } });

        if (result) {
            res.send(movie_id + '영화를 ' + genre_name + ' 장르에서 삭제했습니다.');
        } else {
            res.status(404).send('영화를 찾지 못했습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
