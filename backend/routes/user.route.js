import express from "express";
import {
  bookmarks,
  editProfile,
  followorUnfollow,
  getAllUsers,
  getBookmarks,
  getMyProfile,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthenticated, followorUnfollow);
router.route("/all").get(getAllUsers);
router.route("/me").get(isAuthenticated, getMyProfile);

router.post("/bookmark/:postId", isAuthenticated, bookmarks);
router.get("/bookmarks", isAuthenticated, getBookmarks)

export default router;
