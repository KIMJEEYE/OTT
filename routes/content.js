// 콘텐츠 관리에 관련된 라우트를 처리
//: 콘텐츠 유효 기간 관리, 콘텐츠 업로드, 메타데이터 관리, 스트리밍 서비스 및 보존 기간 관리

const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Movie = require('../models/Movie');
// const Genre = require('../models/genre');
const passport = require('passport');

// 콘텐츠 등록
router.post('/content', async (req, res, next) => {
    try {
        const content = await Content.create(req.body);
        res.status(201).json(content);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 목록 조회
router.get('/content', async (req, res, next) => {
    try {
        const contents = await Content.findAll();
        res.json(contents);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 상세 조회
router.get('/content/:content_id', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            res.json(content);
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 수정
router.put('/content/:content_id', async (req, res, next) => {
    try {
        const content = await Content.update({ name: req.body.name }, { where: { id: req.params.content_id } });
        if (content) {
            res.json(content);
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 삭제
router.delete('/content/:content_id', async (req, res, next) => {
    try {
        const result = await Content.destroy({ where: { id: req.params.content_id } });
        if (result) {
            res.status(200).send('Content deleted');
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 목록 조회
router.get('/content/:content_id/genres', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genres = await content.getGenres();
            res.json(genres);
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 추가
router.post('/content/:content_id/genres/:genre_id', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genre = await Genre.findOne({ where: { id: req.params.genre_id } });
            if (genre) {
                await content.addGenre(genre);
                res.json(content);
            } else {
                res.status(404).send('Genre not found');
            }
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 삭제
router.delete('/content/:content_id/genres/:genre_id', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genre = await Genre.findOne({ where: { id: req.params.genre_id } });
            if (genre) {
                await content.removeGenre(genre);
                res.json(content);
            } else {
                res.status(404).send('Genre not found');
            }
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 수정
router.put('/content/:content_id/genres/:genre_id', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genre = await Genre.findOne({ where: { id: req.params.genre_id } });
            if (genre) {
                await content.setGenres([genre]);
                res.json(content);
            } else {
                res.status(404).send('Genre not found');
            }
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 전체 수정
router.put('/content/:content_id/genres', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genres = await Genre.findAll({ where: { id: req.body.genre_ids } });
            if (genres) {
                await content.setGenres(genres);
                res.json(content);
            } else {
                res.status(404).send('Genre not found');
            }
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 전체 삭제
router.delete('/content/:content_id/genres', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            await content.setGenres([]);
            res.json(content);
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 수 조회
router.get('/content/:content_id/genres/count', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genres = await content.getGenres();
            res.json({ genres: genres.length });
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 중복 조회
router.get('/content/:content_id/genres/:genre_id', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genre = await Genre.findOne({ where: { id: req.params.genre_id } });
            if (genre) {
                const genres = await content.getGenres({ where: { id: req.params.genre_id } });
                res.json({ genres: genres.length });
            } else {
                res.status(404).send('Genre not found');
            }
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 장르 중복 삭제
router.delete('/content/:content_id/genres/:genre_id', async (req, res, next) => {
    try {
        const content = await Content.findOne({ where: { id: req.params.content_id } });
        if (content) {
            const genre = await Genre.findOne({ where: { id: req.params.genre_id } });
            if (genre) {
                await content.removeGenre(genre);
                res.json(content);
            } else {
                res.status(404).send('Genre not found');
            }
        } else {
            res.status(404).send('Content not found');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
