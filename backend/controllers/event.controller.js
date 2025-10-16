import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Event } from "../models/event.model.js";
import { User } from "../models/user.model.js";

// Create a new event
export const addNewEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      venue,
      organizer,
      category,
      type,
      tags,
      registrationLink,
    } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Event banner image is required",
        success: false,
      });
    }

    // Optimize and upload image
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 1200, height: 800, fit: "cover" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      organizer,
      category,
      type,
      tags,
      registrationLink,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.events.push(event._id);
      await user.save();
    }

    await event.populate({ path: "author", select: "username profilePicture" });

    return res.status(201).json({
      message: "New event created",
      event,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
  .sort({ createdAt: -1 })
  .populate({ path: "author", select: "username profilePicture" })
  .populate({ path: "comments.user", select: "username profilePicture" }); // <-- add this


    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get events by logged-in user
export const getUserEvents = async (req, res) => {
  try {
    const authorId = req.id;
    const events = await Event.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" });

    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Like an event
export const likeEvent = async (req, res) => {
  try {
    const userId = req.id;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ message: "Event not found", success: false });

    await event.updateOne({ $addToSet: { likes: userId } });

    event.likes.push();
    await event.save();

    //implementing socket io for real time notification

    return res.status(200).json({ message: "Event Liked", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Dislike an event
export const dislikeEvent = async (req, res) => {
  try {
    const userId = req.id;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ message: "Event not found", success: false });

    await event.updateOne({ $pull: { likes: userId } });

    event.likes.push()
    await event.save();

    return res.status(200).json({ message: "Event Disliked", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const authorId = req.id;

    const event = await Event.findById(eventId);
    if (!event)
      return res
        .status(404)
        .json({ message: "Event not found", success: false });

    if (event.author.toString() !== authorId)
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this event" });

    await Event.findByIdAndDelete(eventId);

    const user = await User.findById(authorId);
    if (user) {
      user.events = user.events.filter((id) => id.toString() !== eventId);
      await user.save();
    }

    return res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


// Add Comment to Event
export const addCommentToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const commentedByUserId = req.id;
    const { text } = req.body;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found", success: false });

    if (!text)
      return res.status(400).json({ message: "Text is required", success: false });

    const comment = {
      user: commentedByUserId,
      text,
      createdAt: new Date(),
    };

    event.comments.push(comment);
    await event.save();

    // Populate only the last added comment
    await event.populate({
      path: "comments.user",
      select: "username profilePicture",
    });

    const newComment = event.comments[event.comments.length - 1];

    return res.status(201).json({
      message: "Comment Added",
      comment: newComment, // ✅ only send the new comment
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


// Get All Comments of an Event
export const getCommentsOfEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId).populate(
      "comments.user",
      "username profilePicture"
    );

    if (!event)
      return res.status(404).json({ message: "Event not found", success: false });

    return res.status(200).json({ success: true, comments: event.comments });
  } catch (error) {
    console.log(error);
  }
};

// Bookmark Event
export const bookmarkEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.id;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found", success: false });

    const user = await User.findById(userId);

    if (user.bookmarks.includes(event._id)) {
      // Remove bookmark if already exists
      await user.updateOne({ $pull: { bookmarks: event._id } });
      await user.save();

      return res.status(200).json({
        message: "Removed from bookmark",
        type: "unsaved",
        success: true,
      });
    } else {
      // Add to bookmarks
      await user.updateOne({ $addToSet: { bookmarks: event._id } });
      await user.save();

      return res.status(200).json({
        message: "Added to bookmark",
        type: "saved",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};