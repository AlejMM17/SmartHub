/** @format */

const Activity = require("../models/Activity");
const Project = require("../models/Project");
const logger = require('../utils/logger');

const activityController = {
  getAllActivities: async (req, res) => {
    try {
      const activities = await Activity.find();
      res.status(200).json(activities);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo usuarios" });
    }
  },
  getActivity: async (req, res) => {
    try {
      const activity = await Activity.findById(req.params.id);
      res.status(200).json(activity);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo usuario" });
    }
  },
  getActivitiesByProject: async (req, res) => {
    try {
      // Obtener el proyecto por su ID
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Obtener los IDs de las actividades del proyecto
      const activityIds = project.activities;

      // Buscar las actividades usando los IDs
      const activities = await Activity.find({ _id: { $in: activityIds }, archive_date: null });

      logger.info("Fetched activities for project with ID: " + req.params.projectId);
      res.status(200).json(activities);
    } catch (error) {
      logger.error(`Error fetching activities for project: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },
  createActivity: async (req, res) => {
    const activity = new Activity(req.body);
    try {
      const newActivity = await activity.save();

      await Project.findByIdAndUpdate(
        req.body.project_id,
        { $push: { activities: newActivity._id } },
        { new: true }
      );

      res.status(201).json(newActivity);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  },
  updateActivity: async (req, res) => {
    try {
      const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.status(200).json({
        message: "Actividad actualizada correctamente",
        activity,
      });
    } catch (e) {
      res.status(500).json({
        message: "Actividad no actualizada",
      });
    }
  },
  deleteActivity: async (req, res) => {
    try {
      const activity = await Activity.findByIdAndUpdate(
        req.params.id,
        { archive_date: Date.now() },
        { new: true }
      );
      if (!activity) {
        throw new Error("No se ha encontrado la actividad");
      }
      res.status(200).json({ message: "Actividad archivada" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "No se ha podido eliminar la actividad" });
    }
  },
};

module.exports = activityController;
