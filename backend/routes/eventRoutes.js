import express from "express";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {ROLES} from "../config/roles.js";

const router = express.Router();

// @route   GET /api/events
router.get("/", getEvents);

// @route   GET /api/events/:id
router.get("/:id", getEventById);

// @route   POST /api/events
router.post("/", verifyToken, verifyRole(ROLES.ADMIN), createEvent);

// @route   PUT /api/events/:id
router.put("/:id", verifyToken, verifyRole(ROLES.ADMIN), updateEvent);

// @route   DELETE /api/events/:id
router.delete("/:id", verifyToken, verifyRole(ROLES.ADMIN), deleteEvent);

export default router;
