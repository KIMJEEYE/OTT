// 제작사 관리에 관련된 라우트를 처리
// /manufacturers
// 제작사 목록 조회: GET /manufacturers
// 제작사 상세 조회: GET /manufacturers/:manufactuer_id
// 제작사 등록: POST /manufacturers
// 제작사 수정: PUT /manufacturers/:manufactuer_id
// 제작사 삭제: DELETE /manufacturers/:manufactuer_id

const express = require('express');
const router = express.Router();
const { Manufacturer } = require('../models');

// 제작사 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const manufacturers = await Manufacturer.findAll();
        res.json(manufacturers);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 제작사 상세 조회
router.get('/:manufacturer_id', async (req, res, next) => {
    try {
        const manufacturer = await Manufacturer.findOne({
            where: { manufacturer_id: req.params.manufacturer_id },
        });
        if (manufacturer) {
            res.json(manufacturer);
        } else {
            res.status(404).json({ message: '해당 제작사가 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 제작사 등록
router.post('/', async (req, res, next) => {
    try {
        const manufacturer = await Manufacturer.create({
            manufacturer_name: req.body.manufacturer_name,
        });
        res.status(201).json(manufacturer);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 제작사 수정
router.put('/:manufacturer_id', async (req, res, next) => {
    try {
        const result = await Manufacturer.update(
            {
                manufacturer_name: req.body.manufacturer_name,
            },
            {
                where: { manufacturer_id: req.params.manufacturer_id },
            }
        );
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 제작사 삭제
router.delete('/:manufacturer_id', async (req, res, next) => {
    try {
        const result = await Manufacturer.destroy({
            where: { manufacturer_id: req.params.manufacturer_id },
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;