import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost
} from "../controllers/postController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/").get(getPosts).post(protect, upload.single("image"), createPost);
router.route("/:id").get(getPostById).delete(protect, deletePost);
router.route("/:id/like").put(protect, likePost);

export default router;
