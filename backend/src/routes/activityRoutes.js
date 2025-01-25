const express = require('express');
const multer = require('multer');
const router = express.Router();
const activityController = require('../controllers/activityController');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivity);
router.get('/project/:projectId', activityController.getActivitiesByProject);
router.post('/', upload.single('activity_picture'), activityController.createActivity);
router.put('/:id', upload.single('activity_picture'), activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
