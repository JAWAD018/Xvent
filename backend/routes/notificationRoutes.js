import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/:id/read").put(protect, markAsRead);
router.route("/:id").delete(protect, deleteNotification);

export default router;
