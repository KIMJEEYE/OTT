// 제작사 관리에 관련된 라우트를 처리
const express = require('express');
const router = express.Router();
const ProdnCo = require('../models/ProdnCo');
const Movie = require('../models/Movie');
const models = require('../models');

// 제작사 목록 조회
router.get('/', async (req, res, next) => {
    try{
        const prodnco = await ProdnCo.findAll({
            attributes: ['id', 'name', 'ceo', 'homepage'],
            include: [{ model: Movie, as: 'Movies', through: models.ProdnCoMovies }],
        });
        res.render('prodnCo', {
            title: require('../package.json').name,
            port: process.env.PORT,
            prodnco: prodnco,
        });

    } catch(err){
        console.error(err);
        next(err);
    }
});
    
router.get('/:prodnco_id', async (req, res, next) => {
    try {
        const prodnco = await ProdnCo.findOne({
            where: { id: req.params.prodnco_id },
            include: [{ model: Movie, as: 'Movies', through: models.ProdnCoMovies }],
        });      
        if (prodnco) {
            res.json(prodnco);
        } else {
            res.status(404).json({ message: '해당 제작사가 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;