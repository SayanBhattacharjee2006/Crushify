import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
    if (socket) return;
    socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",{
        withCredentials: true,
        auth: {token},
        autoConnect: true
    });

    socket.on("connect",() => {
        console.log(" 🟢 socket connected", socket.id);
    })

    socket.on("connect_error",() => {
        console.log(" 💣 socket connection error", socket.id);
    })
    
    return socket;
}

export const disconnectSocket = () =>{
    if(!socket) return;
    socket.disconnect();
    socket = null;
}

export const getSocket = () => socket;