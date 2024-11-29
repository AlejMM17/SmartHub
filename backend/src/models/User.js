const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4 },
    name: { type: String, required: true },
    role: { type: String, enum: ['student','professor'] , required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    project_picture: { type: String, required: true },
    assigned_projects: [{type: String, ref:'Project' }],
    create_date: { type: Date, default: Date.now },
    archive_date: { type: Date},
    modify_date: { type: Date}
});
  
const User = mongoose.model('User',userSchema);
module.exports = User;