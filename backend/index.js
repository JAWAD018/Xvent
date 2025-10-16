import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import eventRoute from "./routes/event.route.js";
// import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();

//  Connect to MongoDB first
connectDB();

const PORT = process.env.PORT || 3000;

//  CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://xvent.vercel.app",       // your deployed frontend
  "https://xvent.onrender.com"      // (optional) same-origin calls
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
    success: true,
  });
});

//  API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/event", eventRoute);
// app.use("/api/v1/message", messageRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
