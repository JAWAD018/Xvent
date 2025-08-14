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





import dotenv from "dotenv";
// import cors from "cors";
// import morgan from "morgan";
import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import eventRoutes from "./routes/eventRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
// import notificationRoutes from "./routes/notificationRoutes.js";

// // Load env variables
// dotenv.config();

// // DB Connection
// connectDB();

// const app = express();

// app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse form-data
// app.use(cors());
// app.use(morgan("dev"));
// // Security Middlewares
// app.use(helmet());
// app.use(xss());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: "Too many requests from this IP, please try again later."
//   })
// );
// app.use(cookieParser());
// // CORS
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true
// }));
// // Body Parsers
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/notifications", notificationRoutes);

// // Error handling
// app.use(notFound);
// app.use(errorHandler);

// // Server Listen
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());
app.use((req, res, next) => {
// Simple CSP (adjust if needed)
res.setHeader(
"Content-Security-Policy",
"default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'"
);
next();
});

// Rate limit
app.use(
rateLimit({
windowMs: 15 * 60 * 1000,
max: 100,
standardHeaders: true,
legacyHeaders: false,
message: "Too many requests from this IP, please try again later."
})
);

// CORS + cookies + logs
app.use(
cors({
origin: process.env.CLIENT_URL || "http://localhost:3000",
credentials: true
})
);
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 + errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});