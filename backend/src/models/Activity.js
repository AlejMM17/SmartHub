const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const activitySchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    start_date: { type: Date},
    end_date: { type: Date},
    skills: [{
        skill_id: { type: String, ref: 'Skill' },
        percentage: { type: Number, required: true },
    }],
    state: {type: Boolean, default: false },  
    create_date: { type: Date, default: Date.now },
    archive_date: { type: Date},
    modify_date: { type: Date}
});
  
const Activity = mongoose.model('Activity', activitySchema, 'Activities');
module.exports = Activity;