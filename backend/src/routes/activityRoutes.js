const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');


router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivity);
router.get('/project/:projectId', activityController.getActivitiesByProject);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;
