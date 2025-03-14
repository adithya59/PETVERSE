import express from "express";
import mongoose from "mongoose";
import cors from "cors";;
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import multer from 'multer'
import petRouter from "./routes/pets.route.js"; // ✅ Ensure correct import
import userRouter from "./routes/user.route.js";
import "./services/vaccination.service.js"; // ✅ Import vaccination reminder service

dotenv.config(); // ✅ Ensure .env variables are loaded before usage

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/api/pets", petRouter);
app.use("/api/users", userRouter);
app.use('/uploads', cors({
  origin: "http://localhost:5173",
  methods: ["GET"],
  credentials: true,
}));
app.use('/uploads', express.static('uploads'));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Your frontend URL (same as above)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,  // Allow cookies if needed
  },
});

// WebSocket for Chat Functionality
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", ({ buyerId, sellerId }) => {
    const room = [buyerId, sellerId].sort().join("_");
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", ({ buyerId, sellerId, message }) => {
    const room = [buyerId, sellerId].sort().join("_");
    io.to(room).emit("receiveMessage", { sender: buyerId, message });
    console.log(`Message sent to ${room}:`, message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique filename
  },
});

const upload = multer({ storage: storage });


// Image upload route
app.post('/uploadImage', upload.array('images', 10), (req, res) => {
  if (req.files && req.files.length > 0) {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`); // Store relative path
    res.json({ imageUrls });
  } else {
    res.status(400).json({ message: 'No image files uploaded' });
  }
});

// Base Route
app.get("/", (req, res) => {
  return res.status(201).send("Welcome to Petverse");
});

const PORT = process.env.PORT || 5501;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection Successful.");
    server.listen(PORT, () => {
      console.log(`App is listening at: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log({ message: error.message });
  });
