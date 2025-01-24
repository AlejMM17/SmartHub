const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillsController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', upload.single('icon'), skillController.createSkill);
router.put('/:id', upload.single('icon'), skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;