import express from "express"; // Express.js framework to create the backend server
import dotenv from "dotenv"; // dotenv is used to load environment variables from a `.env` file
import dbConnect from "./database/dbConnect.js";
import cors from "cors"; // CORS (Cross-Origin Resource Sharing) allows frontend & backend communication
import cookieParser from "cookie-parser"; // Parses cookies from incoming requests
import authRout from "./rout/authRout.js";
import userRout from "./rout/userRout.js";

// Load environment variables (from `.env` file)
dotenv.config();

// Creating an Express application and setting up server port from .env or default
const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/auth',authRout);
app.use('/api/user',userRout);

app.get('/', (req, res) => {
    res.json("Aashish Kumar Singh");
})

// (async () => {
// try {
app.listen(PORT, async () => {
    await dbConnect();
    console.log(`Server is running on port ${PORT}`);
})
//     } catch (error) {
//         console.error("Failed to connect to the database: ", error);
//         process.exit(1);
//     }
// })

// const server = createServer(app);