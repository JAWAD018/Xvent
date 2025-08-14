import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").get(verifyToken, getNotifications);
router.route("/:id/read").put(verifyToken, markAsRead);
router.route("/:id").delete(verifyToken, deleteNotification);

export default router;
