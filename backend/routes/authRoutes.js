import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import express from "express";

import { body } from "express-validator";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post(
	"/register",
	[
		body("username")
			.trim()
			.notEmpty().withMessage("Username is required")
			.isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters"),
		body("email")
			.isEmail().withMessage("Valid email is required"),
		body("password")
			.isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
	],
	validateRequest,
	registerUser
);

// @route   POST /api/auth/login
router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Valid email is required"),
		body("password").notEmpty().withMessage("Password is required")
	],
	validateRequest,
	loginUser
);

// @route   GET /api/auth/me
router.get("/me", verifyToken, getCurrentUser);

export default router;
