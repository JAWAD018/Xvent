import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost
} from "../controllers/postController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(getPosts).post(verifyToken, upload.single("image"), createPost);
router.route("/:id").get(getPostById).delete(verifyToken, deletePost);
router.route("/:id/like").put(verifyToken, likePost);

export default router;
