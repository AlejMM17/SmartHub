const Score = require('../models/Scores');

// Obtener todas las puntuaciones
exports.getAllScores = async (req, res) => {
  try {
    const { student_id, activity_id, skill_id, project_id } = req.query;
    const query = {};

    if (student_id) query.student_id = student_id;
    if (activity_id) query.activity_id = activity_id;
    if (skill_id) query.skill_id = skill_id;
    if (project_id) query.project_id = project_id;

    const scores = await Score.find(query);
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una puntuación por ID
exports.getScoreById = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva puntuación
exports.createScore = async (req, res) => {
  const score = new Score(req.body);
  try {
    const newScore = await score.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una puntuación por ID
exports.updateScore = async (req, res) => {
  try {
    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      { ...req.body, modify_date: Date.now() },
      { new: true }
    );
    if (!updatedScore) return res.status(404).json({ message: 'Score not found' });
    res.status(200).json(updatedScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Archivar una puntuación por ID
exports.deleteScore = async (req, res) => {
  try {
    const archivedScore = await Score.findByIdAndUpdate(
      req.params.id,
      { archive_date: Date.now() },
      { new: true }
    );
    if (!archivedScore) return res.status(404).json({ message: 'Score not found' });
    res.status(200).json({ message: 'Score archived', score: archivedScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};