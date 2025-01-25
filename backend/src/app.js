require("dotenv").config();
const uri = process.env.MONGODB_URI;
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

// Importacion del logger
const logger = require("./utils/logger");

// Importa el paquete de Express
const express = require("express");

// Crea una instancia de la aplicación Express
const app = express();

// Middleware para manejar JSON
app.use(express.json());

app.use(cors());

// Middleware contra ataques de SQL injection
app.use(helmet());

mongoose
  .connect(uri)
  .then(() => logger.info("Conectado a MongoDB"))
  .catch((err) => logger.error("Error al conectar a MongoDB", err));

// Configura el puerto
const PORT = process.env.PORT || 3000;

// Importar las rutas
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillsRoutes = require("./routes/skillsRoutes");
const scoresRoutes = require("./routes/scoresRoutes");

// Cargar rutas
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/skills", skillsRoutes);
app.use("/api/v1/scores", scoresRoutes);

// Define una ruta básica
app.get("/", (req, res) => {
  res.send("¡Hola, mundo desde Express!");
});

// Inicia el servidor y escucha en el puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
