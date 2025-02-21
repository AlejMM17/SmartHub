const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4 },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['student','professor'] , required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    user_picture: {
        data: Buffer,
        contentType: String,
    },
    assigned_projects: [{type: String, ref:'Project' }],
    create_date: { type: Date, default: Date.now() },
    archive_date: { type: Date},
    modify_date: { type: Date}
});
  
const User = mongoose.model('User',userSchema, 'Users');

module.exports = User;