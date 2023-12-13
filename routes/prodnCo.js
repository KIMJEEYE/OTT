// 제작사 관리에 관련된 라우트를 처리
const express = require('express');
const router = express.Router();
const ProdnCo = require('../models/ProdnCo');
const Movie = require('../models/Movie');
const models = require('../models');

// 제작사 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const prodnCo = await ProdnCo.findAll();
        res.json(prodnCo);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 제작사 상세 조회
router.post('/prodnco_id', async (req, res, next) => {
    try {
        const prodnCo = await ProdnCo.findOne({
            where: { prodnco_id: req.params.prodnco_id },
        });
        if (prodnCo) {
            res.json(prodnCo);
        } else {
            res.status(404).json({ message: '해당 제작사가 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;