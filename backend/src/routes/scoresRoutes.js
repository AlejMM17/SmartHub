const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoresController');

router.get('/', scoreController.getAllScores);
router.get('/:id', scoreController.getScoreById);
router.post('/', scoreController.createScore);
router.put('/:id', scoreController.updateScore);
router.delete('/:id', scoreController.deleteScore);

module.exports = router;