import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  addComment,
  getCommentsByPost,
  deleteComment
} from "../controllers/commentController.js";

const router = express.Router();

router.route("/:postId").get(getCommentsByPost);
router.route("/:postId").post(verifyToken, addComment);
router.route("/:commentId").delete(verifyToken, deleteComment);

export default router;
