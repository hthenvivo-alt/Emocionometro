const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // En producción, deberías restringir esto
    methods: ["GET", "POST"]
  }
});

// Almacenamiento en memoria de los puntos (estado de la sesión actual)
let activePoints = [];

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Enviar los puntos actuales al cliente que se acaba de conectar (útil para el admin)
  socket.emit('points-updated', activePoints);

  // Escuchar cuando un usuario envía su estado emocional
  socket.on('submit-point', (data) => {
    // data esperado: { nombre: string, x: number, y: number }
    const newPoint = {
      id: socket.id, // Usamos el socket.id o generamos uno
      nombre: data.nombre || 'Anónimo',
      x: data.x, // Placer (0-10)
      y: data.y, // Energía (0-10)
      timestamp: Date.now()
    };
    
    // Podemos optar por actualizar si el socket ya envió, pero como es en vivo, mejor permitimos múltiples envíos si recarga, o lo actualizamos si ya existe:
    const existingIndex = activePoints.findIndex(p => p.id === socket.id);
    if (existingIndex >= 0) {
      activePoints[existingIndex] = newPoint;
    } else {
      activePoints.push(newPoint);
    }

    // Emitir a TODOS los clientes (especialmente al admin)
    io.emit('points-updated', activePoints);
  });

  // Escuchar evento para limpiar la gráfica (solo desde Admin, idealmente con auth pero simplificado aquí)
  socket.on('clear-points', () => {
    activePoints = [];
    io.emit('points-updated', activePoints);
    console.log('Gráfico limpiado por un administrador.');
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    // Opcional: ¿Eliminamos el punto si se desconecta? 
    // Para un show masivo, quizás la gente cierra el celu, mejor mantenemos el punto en el gráfico 
    // hasta que el admin decida limpiar.
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor Socket.io corriendo en el puerto ${PORT}`);
});
