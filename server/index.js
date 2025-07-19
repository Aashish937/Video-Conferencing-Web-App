import express from "express"; // Express.js framework to create the backend server
import dotenv from "dotenv"; // dotenv is used to load environment variables from a `.env` file
import cors from "cors"; // CORS (Cross-Origin Resource Sharing) allows frontend & backend communication
import cookieParser from "cookie-parser"; // Parses cookies from incoming requests

import dbConnect from "./database/dbConnect.js";
import authRout from "./rout/authRout.js";
import userRout from "./rout/userRout.js";

import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables (from `.env` file)
dotenv.config();

// Creating an Express application and setting up server port from .env or default
const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);

const allowedOrigins = [process.env.CLIENT_URL];

// 🔧 Middleware to handle CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // ✅ Allow the request if it's from an allowed origin
        } else {
            callback(new Error('Not allowed by CORS')); // ❌ Block requests from unknown origins
        }
    },
    credentials: true, // ✅ Allow sending cookies with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // ✅ Allow these HTTP methods
}));

// 🛠 Middleware for handling JSON requests and cookies
app.use(express.json()); // Enables parsing of JSON request bodies
app.use(cookieParser()); // Enables reading cookies in HTTP requests

// 🔗 Define API routes
app.use('/api/auth', authRout);
app.use('/api/user', userRout);

app.get('/', (req, res) => {
    res.json("Aashish Kumar Singh");
});

// Initialize Socket.io for real-time communication
const io = new Server(server, {
    pingTimeout: 60000, // Set timeout for inactive users (1 minute)
    cors: {
        origin: allowedOrigins[0], // Allow requests from the frontend URL
        methods: ['GET', 'POST'] // Allow only these methods
    }
});
console.log("Successfully Socket.io intialized with CORS");

let onlineUsers = [];

// Handle WebSocket (Socket.io) connections
io.on("connection", (socket) => {
    console.log(`Information - new connection: ${socket.id}`)

    // Emit an event to send the socket ID to the connected user
    socket.emit("me", socket.id);

    // User joins the chat system
    socket.on("join", (user) => {
        if (!user || !user.id) {
            console.log("warning - Invalid User data to join");
            return;
        }

        socket.join(user.id); // Add user to a room with their ID
        const existingUser = onlineUsers.find((u) => u.userId === user.id); // Check if user is already online

        if (existingUser) {
            existingUser.socketId = socket.id; // Update socket ID if user reconnects
        } else {
            // Add new user to online users list
            onlineUsers.push({
                userId: user.id,
                name: user.name,
                socketId: socket.id
            })
        }
        io.emit("online-users", onlineUsers);
    })

    // Handle user disconnecting from the server
    socket.on("disconnect", () => {
        const user = onlineUsers.find((u) => u.socketId === socket.id); // Find the disconnected user
        // if (user) {
        //     activeCalls.delete(user.userId); // Remove the user from active calls

        //     // Remove all calls associated with this user
        //     for (const [key, value] of activeCalls.entries()) {
        //         if (value.with === user.userId) activeCalls.delete(key);
        //     }
        // }

        // Remove user from the online users list
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

        // 🔹 Broadcast updated online users list
        io.emit("online-users", onlineUsers);

        // 🔹 Notify others that the user has disconnected
        socket.broadcast.emit("disconnectUser", { disUser: socket.id });

        console.log(`[INFO] Disconnected: ${socket.id}`); // Debugging: User disconnected
    });

    // //  Handle outgoing call request
    // socket.on("callToUser", (data) => {
    //     const callee = onlineUsers.find((user) => user.userId === data.callToUserId); // Find the user being called

    //     if (!callee) {
    //         socket.emit("userUnavailable", { message: "User is offline." }); // ❌ Notify caller if user is offline
    //         return;
    //     }

    //     // If the user is already in another call
    //     if (activeCalls.has(data.callToUserId)) {
    //         socket.emit("userBusy", { message: "User is currently in another call." });

    //         io.to(callee.socketId).emit("incomingCallWhileBusy", {
    //             from: data.from,
    //             name: data.name,
    //             email: data.email,
    //             profilepic: data.profilepic,
    //         });

    //         return;
    //     }

    //     // Emit an event to the receiver's socket (callee)
    //     io.to(callee.socketId).emit("callToUser", {
    //         signal: data.signalData, // WebRTC signal data
    //         from: data.from, // Caller ID
    //         name: data.name, // Caller name
    //         email: data.email, // Caller email
    //         profilepic: data.profilepic, // Caller profile picture
    //     });
    // });
});


(async () => {
    try {
        await dbConnect();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Failed to connect to the database: ", error);
        process.exit(1);
    }
})();

// const server = createServer(app);