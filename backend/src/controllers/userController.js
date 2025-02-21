const User = require("../models/User");
const logger = require("../utils/logger");
const {log} = require("winston");
const csvParser = require('csv-parser');
const stream = require('stream');
const bcrypt = require('bcrypt');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password"); // No enviar passwords

      const usersWithImages = users.map((user) => {
        const { user_picture, ...otherFields } = user.toObject(); // toObject ensures it’s a plain JS object

        return {
          ...otherFields,
          user_picture: user_picture && user_picture.data
              ? `data:${user_picture.contentType};base64,${user_picture.data.toString("base64")}`
              : null,
        };
      });

      res.status(200).json(usersWithImages);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo usuarios" });
    }
  },
  getAllStudents: async (req, res) => {
    try {
      const users = await User.find({ role: "student"}).select("-password"); // No enviar passwords

      const usersWithImages = users.map((user) => {
        const { user_picture, ...otherFields } = user.toObject();

        return {
          ...otherFields,
          user_picture: user_picture && user_picture.data
              ? `data:${user_picture.contentType};base64,${user_picture.data.toString("base64")}`
              : null,
        };
      });

      res.status(200).json(usersWithImages);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo alumnos" });
    }
  },
  getStudentsByProjectId: async (req, res) => {
    try {
      const users = await User.find({
        $and: [
          { role: "student" },
          { archive_date: null },
          { assigned_projects: req.params.id }
        ]
      }).select("-password"); // No enviar passwords

      const usersWithImages = users.map((user) => {
        const { user_picture, ...otherFields } = user.toObject();

        return {
          ...otherFields,
          user_picture: user_picture && user_picture.data
              ? `data:${user_picture.contentType};base64,${user_picture.data.toString("base64")}`
              : null,
        };
      });

      res.status(200).json(usersWithImages);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo alumnos de project: " + req.params.id });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password"); // No enviar passwords

      const { user_picture, ...otherFields } = user.toObject();
      const userWithImage = {
        ...otherFields,
        user_picture: user_picture && user_picture.data
            ? `data:${user_picture.contentType};base64,${user_picture.data.toString("base64")}`
            : null,
      };

      return !user
          ? res.status(404).json({ message: 'User not found' })
          : res.status(200).json(userWithImage)
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo usuario" });
    }
  },
  createUser: async (req, res) => {
    try {
      const { name, lastName, role, email, password } = req.body;

      if (!name || !lastName || !email || !password || !role) {
        return res.status(400).json({
          error: "Faltan campos obligatorios: name, lastName, email, password, role",
        });
      }

      const userExists = await User.findOne({ email })
      if (userExists) {
        return res.status(400).json({
          message: "El correo ya existe",
        })
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(hashedPassword);

      const userObject = {
        name,
        lastName,
        role,
        email,
        password: hashedPassword,
      }

      if (req.file) {
        userObject.user_picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        }
      }

      const newUser = new User(userObject);

      const savedUser = await newUser.save();

      return !savedUser
          ? res.status(404).json({ message: 'User not found' })
          : res.status(201).json({
            message: "Usuario creado correctamente",
            user: savedUser,
          });

    } catch (e) {
      res.status(400).json({
        message: "Usuario no creado",
      });
    }
  },
  importUsers: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }

      const fileBuffer = req.file.buffer; // The file content as a Buffer

      const results = [];
      const createdUsers = []; // To keep track of successfully created users

      // Convert the Buffer into a readable stream
      const readableStream = new stream.Readable();
      readableStream.push(fileBuffer);
      readableStream.push(null);

      // Parse the CSV file
      readableStream
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            try {
              for (const studentData of results) {
                try {
                  const saltRounds = 10;
                  const hashedPassword = await bcrypt.hash(studentData.password, saltRounds);
                  // Create a new User instance
                  const newUser = new User({
                    name: studentData.name,
                    lastName: studentData.lastName,
                    email: studentData.email,
                    password: hashedPassword,
                    role: studentData.role || "student",
                    // Add any other necessary fields
                  });

                  const existingUser = await User.findOne({ email: studentData.email });
                  if (existingUser) {
                    console.warn(`User with email ${studentData.email} already exists`);
                    continue; // Skip this user
                  }

                  await newUser.save(); // Save the user to MongoDB
                  createdUsers.push(newUser);
                } catch (error) {
                  console.error(`Error creating user: ${error.message}`);
                  // Handle individual user creation errors (e.g., duplicate email)
                }
              }

              // Respond with the list of created users
              res.status(200).json({
                message: 'Students imported successfully',
                createdUsers: createdUsers,
              });
            } catch (error) {
              console.error('Error processing the users:', error);
              res.status(500).json({ error: 'Error importing students' });
            }
          })
          .on('error', (error) => {
            console.error('Error reading the file:', error);
            res.status(500).json({ error: 'Error reading file' });
          });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Error importing students' });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, lastName, role, email, password } = req.body;

      // Crear un objeto con los campos a actualizar
      const updateFields = {};
      if (name) updateFields.name = name;
      if (lastName) updateFields.lastName = lastName;
      if (role) updateFields.role = role;
      if (email) updateFields.email = email;
      if (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updateFields.password, saltRounds);
        updateFields.password = hashedPassword
      }

      if (req.file) {
        updateFields.user_picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({
        message: "Usuario no actualizado",
        errors: error.errors,
      });
    }
  },
  assignUserToAProject: async (req, res) => {
    try {
      const users = req.body;
      const projectId = req.params.id;

      if (!users || !Array.isArray(users) || !projectId) {
        return res.status(400).json({ error: "Invalid input data" });
      }

      const lastAssignedStudents = await User.find({
        role: "student",
        assigned_projects: projectId,
      });


      const studentsToRemove = lastAssignedStudents.filter(
          (student) => !users.includes(student._id.toString())
      );

      await User.updateMany(
          { _id: { $in: studentsToRemove.map((student) => student._id) } },
          { $pull: { assigned_projects: projectId } }
      );

      const result = await User.updateMany(
          {
            _id: { $in: users },
            assigned_projects: { $ne: projectId },
          },
          {
            $push: { assigned_projects: projectId },
          }
      );

      return res.status(200).json({
        message: "Users updated successfully",
        modifiedCount: result.modifiedCount,
      });
    } catch (e) {
      console.error('Error durante la actualización:', e);
      res.status(500).json({
        message: "Usuarios no actualizados",
        errors: e.errors,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { archive_date: Date.now() }, {new: true})
      if (!user) {
        throw new Error("No se ha encontrado el User")
      } 
      res.status(200).json({ message: "Usuario archivado" });
      
    } catch (e) {
      res.status(500).json({ message: "No se ha podido eliminar el usuario" });
    }
  },
};

module.exports = userController;
