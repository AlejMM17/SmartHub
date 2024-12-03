/** @format */

require("dotenv").config();
const User = require("./models/User");
const uri = process.env.MONGODB_URI;
const mongoose = require("mongoose");
const cors = require('cors')

app.use(cors());

mongoose
  .connect(uri)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB", err));

// Importa el paquete de Express
const express = require("express");

// Crea una instancia de la aplicación Express
const app = express();

// Configura el puerto
const PORT = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Cargar rutas
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes')); 
app.use('/api/v1/projects', require('./routes/projectRoutes')); 
app.use('/api/v1/activities', require('./routes/activityRoutes')); 
app.use('/api/v1/skill', require('./routes/skillRoutes'));


// Define una ruta básica
app.get("/", (req, res) => {
  res.send("¡Hola, mundo desde Express!");
});


app.post("/api/v1/user", async (req, res) => {
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
      user: {
        id: savedUser._id,
        name: savedUser.name,
        role: savedUser.role,
        email: savedUser.email,
        create_date: savedUser.create_date,
      },
    });
  } catch (e) {
    res.status(400).json({
      message: "Usuario no creado",
    });
    return;
  }
});

// Inicia el servidor y escucha en el puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
