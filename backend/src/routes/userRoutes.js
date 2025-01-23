const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', userController.getAllUsers);
router.get('/students', userController.getAllStudents);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.post('/import', upload.single('file'), userController.importUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;