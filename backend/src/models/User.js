const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    _id: {type: String, default: uuidv4 },
    name: { type: String, required: true },
    role: { type: String, enum: ['student','professor'] , required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    user_picture: { type: String, default: "./defaultPFP"},
    assigned_projects: [{type: String, ref:'Project' }],
    create_date: { type: Date, default: Date.now() },
    archive_date: { type: Date},
    modify_date: { type: Date}
});
  
<<<<<<< Updated upstream
const User = mongoose.model('User',userSchema, 'Users');
=======
const User = mongoose.model('User', userSchema);
>>>>>>> Stashed changes
module.exports = User;