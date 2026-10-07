import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://chat-app-project-gray.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;

    console.log("SOCKET CONNECTED:", socket.id);
    console.log("USER ID:", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit(
        "getOnlineUsers",
        Object.keys(userSocketMap)
    );

    socket.on("disconnect", (reason) => {

        console.log(
            "SOCKET DISCONNECTED:",
            socket.id,
            reason
        );

        if (
            userId &&
            userSocketMap[userId] === socket.id
        ) {
            delete userSocketMap[userId];
        }

        io.emit(
            "getOnlineUsers",
            Object.keys(userSocketMap)
        );
    });
});

export { app, server, io };
