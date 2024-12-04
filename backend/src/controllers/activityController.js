/** @format */

const Activity = require("../models/Activity");

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
  createActivity: async (req, res) => {
    try {
      const { name, descripcion } = req.body;

      if (!name || !descripcion) {
        return res.status(400).json({
          message: "Faltan campos obligatorios: name, email, password, role",
        });
      }

      const newActivity = new Activity({
        name,
        descripcion,
      });

      const savedActivity = await newActivity.save();

      res.status(201).json({
        message: "Actividad creada correctamente",
        activity: savedActivity,
      });
    } catch (e) {
      res.status(500).json({
        message: "Actividad no creada",
      });
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
        const activity = await Activity.findByIdAndUpdate(req.params.id, { archive_date: Date.now() }, { new: true })
        if (!activity) {
          throw new Error("No se ha encontrado la actividad")
        } 
        res.status(200).json({ message: "Actividad archivada" });
        
      } catch (e) {
        res.status(500).json({ message: "No se ha podido eliminar la actividad" });
      }
  },
};

module.exports = activityController;
