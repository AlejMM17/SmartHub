const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const scoreSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    student_id: { type: String, ref: 'User', required: true },
    score: { type: Number, required: true}, 
    activity_id: { type: String, ref: 'Activity', required: true }, 
    skill_id: { type: String, ref: 'Skill', required: true },
    project_id: { type: String, ref: 'Project', required: true }, 
});
  
const Score = mongoose.model('Score', scoreSchema);
module.exports = Score;