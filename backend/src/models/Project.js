const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const projectSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    professor_id: { type: String, ref: 'User', required:true },
    activities: [{ type: String, ref: 'Activity' }],
    skills: [{
        skill_id: { type: String, ref: 'Skill' },
        percentage: { type: Number, required: true }
    }],
    create_date: { type: Date, default: Date.now },
    archive_date: { type: Date},
    modify_date: { type: Date}
});
  
const Project = mongoose.model('Project', projectSchema, 'Projects');
module.exports = Project;