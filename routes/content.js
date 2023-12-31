const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Movie = require('../models/Movie');
const { isAdmin } = require('./helpers');

router.get('/', isAdmin, async (req, res, next) => {
    try {
        const contents = await Content.findAll();
        res.render('content', {
            title: require('../package.json').name,
            port: process.env.PORT,
            contents: contents
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.post('/', isAdmin, async (req, res, next) => {
    try {
        
        const { movieId, retentionPeriod } = req.body;

     
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ error: '영화를 찾을 수 없습니다.' });
        }

        // Content 모델을 생성할 때 업로드 날짜를 현재 시간으로, retentionPeriod를 기본값으로, validityPeriod를 현재 날짜로 설정
        const content = await Content.create({
            movieId,
            uploadDate: new Date(),  
            retentionPeriod: retentionPeriod || 30,  
            validityPeriod: new Date(),  
        });

        // 생성된 content로 응답
        res.status(201).json(content);
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// 콘텐츠 조회
router.get('/contents', isAdmin, async (req, res, next) => {
    try {
        const contents = await Content.findAll({
            attributes: ['id','validityPeriod', 'uploadDate', 'retentionPeriod'],
        });
        
        res.json({ contents: contents });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 수정
router.post('/update', isAdmin, async (req, res, next) => {
    try {
        const updateContent = await Content.update(
            {
                validityPeriod: req.body.validityPeriod,
                retentionPeriod: req.body.retentionPeriod
            },
            { where: { id: req.body.id } }
        );
        res.status(200).send('콘텐츠를 수정했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 콘텐츠 삭제
router.post('/delete', isAdmin, async (req, res, next) => {
    try {
        const deleteContent = await Content.destroy({
            where: { id: req.body.id }
        });
        res.status(200).send('콘텐츠를 삭제했습니다.');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
