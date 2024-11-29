const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const skillSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: {type: String, required:true},
    create_date: { type: Date, default: Date.now },
    archive_date: { type: Date},
    modify_date: { type: Date}
});
  
const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;