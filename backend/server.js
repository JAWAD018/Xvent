// // server.js
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import connectDB from "./config/db.js";

// // Load env variables
// dotenv.config();

// // Connect to DB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json({ limit: "10mb" }));
// app.use(cookieParser());

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import eventRoutes from "./routes/eventRoutes.js";
// import userRoutes from "./routes/userRoutes.js";

// app.use("/api/auth", authRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/users", userRoutes);

// // Default route
// app.get("/", (req, res) => {
//   res.send("Xvent API is running 🚀");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error"
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });





import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Load env variables
dotenv.config();

// DB Connection
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-data
app.use(cors());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
