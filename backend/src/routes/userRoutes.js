const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', userController.getAllUsers);
router.get('/students', userController.getAllStudents);
router.get('/students/:id', userController.getStudentsByProjectId);
router.get('/:id', userController.getUser);
router.post('/', upload.single('user_picture'), userController.createUser);
router.post('/import', upload.single('file'), userController.importUsers);
router.put('/:id', upload.single('user_picture'), userController.updateUser);
router.put('/students/:id', userController.assignUserToAProject);
router.delete('/:id', userController.deleteUser);

module.exports = router;