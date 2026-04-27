import { io } from 'socket.io-client';

// En producción usa la URL de Render. En local usa la misma IP en la que estés (ej: 192.168.x.x) para permitir conexión desde celulares
const URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? undefined : `http://${window.location.hostname}:3001`);

export const socket = io(URL);
