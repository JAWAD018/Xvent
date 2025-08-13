import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import ROLES from "../config/roles.js";

const router = express.Router();

// @route   GET /api/users
router.get("/", verifyToken, verifyRole(ROLES.ADMIN), getUsers);

// @route   GET /api/users/:id
router.get("/:id", verifyToken, verifyRole(ROLES.ADMIN), getUserById);

// @route   PUT /api/users/:id
router.put("/:id", verifyToken, verifyRole(ROLES.ADMIN), updateUser);

// @route   DELETE /api/users/:id
router.delete("/:id", verifyToken, verifyRole(ROLES.ADMIN), deleteUser);

export default router;
