const User = require("../models/User");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password"); // No enviar passwords
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Error obteniendo usuarios" });
    }
  },
  getUser: async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // No enviar passwords
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ message: "Error obteniendo usuario" });
      }
  },
  createUser: async (req, res) => {
    try {
      const { name, role, email, password } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: "Faltan campos obligatorios: name, email, password, role",
        });
      }

      const newUser = new User({
        name,
        role,
        email,
        password,
      });

      const savedUser = await newUser.save();

      res.status(201).json({
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
      const users = req.body;
  
      if (!Array.isArray(users) || users.length == 0) {
        return res.status(400).json({
          error: "Debe proporcionar una lista de usuarios",
        });
      }
  
      const requiredFields = ["name", "role", "email", "password"];
      for (const user of users) {
        for (const field of requiredFields) {
          if (!user[field]) {
            return res.status(400).json({
              error: `Faltan campos obligatorios en uno o más usuarios: ${requiredFields.join(", ")}`,
            });
          }
        }
      }
  
      const savedUsers = await User.insertMany(users);
  
      res.status(201).json({
        message: "Usuarios importados correctamente",
        users: savedUsers,
      });
    } catch (e) {
      res.status(400).json({
        message: "Usuarios no importados",
        error: e.message,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({
        message: "Usuario no actualizado",
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
