const express = require('express');
const { saveProject, getProjectById, getPublicProjects, getMyProjects } = require('../controllers/projectController');
const router = express.Router();

router.post('/', saveProject);
router.get('/public', getPublicProjects);
router.get('/my-projects', getMyProjects);
router.get('/:id', getProjectById);

module.exports = router;