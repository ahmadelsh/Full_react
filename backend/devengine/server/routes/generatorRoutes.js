const express = require('express');
const { generateCode } = require('../controllers/generatorController');
const router = express.Router();

router.post('/', generateCode);

module.exports = router;