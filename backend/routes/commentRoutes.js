import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addComment,
  getCommentsByPost,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.route("/:postId").get(getCommentsByPost);
router.route("/:postId").post(protect, addComment);
router.route("/:commentId").delete(protect, deleteComment);

export default router;
