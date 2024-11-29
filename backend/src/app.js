require('dotenv').config();

const User = require('./models/User');

const uri = process.env.MONGODB_URI;
const mongoose = require('mongoose');

mongoose.connect(uri) 
  .then(() => console.log('Conectado a MongoDB')) 
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Importa el paquete de Express
const express = require('express');

// Crea una instancia de la aplicación Express
const app = express();

// Configura el puerto
const PORT = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Define una ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

// Inicia el servidor y escucha en el puerto configurado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});