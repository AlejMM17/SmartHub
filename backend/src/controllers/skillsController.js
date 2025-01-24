const Skill = require('../models/Skills');

// Obtener todas las habilidades
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();

    const skillsWithIcons = skills.map((skill) => {
      // Destructure the skill object to keep all fields, and handle the icon separately
      const { icon, ...otherFields } = skill.toObject(); // toObject ensures it’s a plain JS object

      return {
        ...otherFields, // Spread the rest of the properties
        icon: icon && icon.data
            ? `data:${icon.contentType};base64,${icon.data.toString("base64")}`
            : null,
      };
    });

    res.status(200).json(skillsWithIcons);
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

// Crear una nueva skill
exports.createSkill = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Icon is required" });
    }

    const newSkill = new Skill({
      name,
      description,
      icon: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      }
    });

    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una habilidad por ID
exports.updateSkill = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateFields = {
      name,
      description,
      modify_date: Date.now(),
    };

    if (req.file) {
      updateFields.icon = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

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