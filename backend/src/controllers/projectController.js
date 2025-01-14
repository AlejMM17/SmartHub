const Project = require('../models/Project');
const logger = require('../utils/logger'); // Importa el logger

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ archive_date: null });
    logger.info('Fetched all projects');
    res.status(200).json(projects);
  } catch (error) {
    logger.error(`Error fetching projects: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      logger.warn(`Project not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Project not found' });
    }
    logger.info(`Fetched project with ID: ${req.params.id}`);
    res.status(200).json(project);
  } catch (error) {
    logger.error(`Error fetching project: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// Get projects by professor_id
exports.getProjectsByProfessorID = async (req, res) => {
  try {
    const query = {
      $and: [
        { professor_id: req.params.id },
        { archive_date: null }
      ]
    };
    const projects = await Project.find(query);
    logger.info('Fetched professor projects with ID: ' + req.params.id);
    res.status(200).json(projects);
  } catch (error) {
    logger.error(`Error fetching professor projects: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

// Create a new project
exports.createProject = async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    logger.info('Created new project');
    res.status(201).json(newProject);
  } catch (error) {
    logger.error(`Error creating project: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, modify_date: Date.now() },
      { new: true }
    );
    if (!updatedProject) {
      logger.warn(`Project not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Project not found' });
    }
    logger.info(`Updated project with ID: ${req.params.id}`);
    res.status(200).json(updatedProject);
  } catch (error) {
    logger.error(`Error updating project: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Archive a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const archivedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { archive_date: Date.now() },
      { new: true }
    );
    if (!archivedProject) {
      logger.warn(`Project not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Project not found' });
    }
    logger.info(`Archived project with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Project archived', project: archivedProject });
  } catch (error) {
    logger.error(`Error archiving project: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};