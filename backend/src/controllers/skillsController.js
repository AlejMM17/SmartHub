const Skill = require('../models/Skills');

// Obtener todas las habilidades
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una habilidad por ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva habilidad
exports.createSkill = async (req, res) => {
  const skill = new Skill(req.body);
  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una habilidad por ID
exports.updateSkill = async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { ...req.body, modify_date: Date.now() },
      { new: true }
    );
    if (!updatedSkill) return res.status(404).json({ message: 'Skill not found' });
    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Archivar una habilidad por ID
exports.deleteSkill = async (req, res) => {
  try {
    const archivedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { archive_date: Date.now() },
      { new: true }
    );
    if (!archivedSkill) return res.status(404).json({ message: 'Skill not found' });
    res.status(200).json({ message: 'Skill archived', skill: archivedSkill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};