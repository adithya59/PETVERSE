import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import petRouter from "./routes/pets.route.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/products.route.js";
import uploadRouter from "./routes/uploads.route.js";
import cartRouter from "./routes/cart.route.js";
import "./services/vaccination.service.js";
import Chat from "./models/chats.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/api/pets", petRouter);
app.use("/api/users", userRouter);
app.use("/api/upload", uploadRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)

// WebSocket for Chat Functionality
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("start_chat", async ({ buyerName, sellerName, buyerId, sellerId }) => {
    let chat = await Chat.findOne({ buyerId, sellerId });

    if (!chat) {
      chat = new Chat({ buyerName, sellerName, buyerId, sellerId, messages: [] });
      await chat.save();
    }

    socket.join(chat._id.toString());
    socket.emit("chat_history", chat.messages);
  });

  socket.on("send_message", async ({ buyerId, sellerId, sender, message }) => {
    const chat = await Chat.findOneAndUpdate(
      { buyerId, sellerId },
      { $push: { messages: { sender, message } } },
      { new: true, upsert: true }
    );

    io.to(chat._id.toString()).emit("receive_message", chat.messages);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Fetch Chat History
app.get("/api/chats/:userId", async (req, res) => {
  const userId = req.params.userId;

  const chats = await Chat.find({
    $or: [{ buyerId: userId }, { sellerId: userId }],
  }).select("buyerName sellerName buyerId sellerId messages");

  res.json(chats);
});

// Base Route
app.get("/", (req, res) => {
  return res.status(201).send("Welcome to Petverse");
});

const PORT = process.env.PORT || 5501;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection Successful.");
    server.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log({ message: error.message });
  });
