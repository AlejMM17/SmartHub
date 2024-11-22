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
