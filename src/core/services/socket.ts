import { io, Socket } from 'socket.io-client';

import * as Config from '@app/configs';

let socket: Socket | null = null;
let isConnecting = false;

export const connectSocket = (token: string): Socket | null => {
  if (!token) {
    console.error('Socket not connected: token missing');

    return null;
  }

  if (socket?.connected) return socket;
  if (isConnecting && socket) return socket;

  isConnecting = true;

  socket = io(Config.SOCKET_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.auth = { token };
  socket.connect();

  socket.on('connect', () => {
    isConnecting = false;
  });

  socket.on('connect_error', (err) => {
    console.error('Socket error:', err.message);
    isConnecting = false;
  });

  socket.on('disconnect', () => {
    isConnecting = false;
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.off('connect');
    socket.off('connect_error');
    socket.off('disconnect');

    socket.disconnect();
    socket = null;
    isConnecting = false;
  }
};

export const isSocketConnected = () => socket?.connected ?? false;
