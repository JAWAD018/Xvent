import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Event } from "../models/event.model.js";



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id username email profilePicture");
    // Only sending safe fields, no password
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Password should be greater than 8 char
     if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        success: false,
      });
    }
    if ((!username || !email || !password)) {
      
      return res.status(401).json({
        message: "Fill all the field",
        success: false,
      });
    }

    // Chekc User name is exist or not so everyone should have unique username 
     const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already taken",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Invalid credentials", // Other people should not know that this email is exist
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

  const populatedPosts = await Promise.all(
  user.posts.map(async (postId) => {
    const post = await Post.findById(postId);
    if (post && post.author && post.author.equals(user._id)) {
      return post;
    }
    return null;
  })
);

const populatedEvents = await Promise.all(
  user.events.map(async (eventId) => {
    const event = await Event.findById(eventId);
    if (event && event.author && event.author.equals(user._id)) {
      return event;
    }
    return null;
  })
);


    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts.filter(Boolean),
      events: populatedEvents.filter(Boolean),
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
        token
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // find user without password
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // populate posts
    const posts = await Post.find({ author: userId });
    // populate events
    const events = await Event.find({ author: userId });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        posts,
        events,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Populate posts
    const posts = await Post.find({ author: req.id });
    const events = await Event.find({ author: req.id });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        profilePicture: user.profilePicture,
        followers: user.followers,
        following: user.following,
        posts,
        events,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not Found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently no suggestion for you",
        // success: false
      });
    }
    return res.status(200).json({
      users: suggestedUsers,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followorUnfollow = async (req, res) => {
  try {
    const whoseFollowing = req.id;
    const imFollowing = req.params.id;
    if (whoseFollowing === imFollowing) {
      return res.status(400).json({
        message: "You can't follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(whoseFollowing);
    const targetUser = await User.findById(imFollowing);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    // checking whether should i follow or not

    const isFollowing = user.following.includes(imFollowing);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: whoseFollowing },
          { $pull: { following: imFollowing } }
        ),
        User.updateOne(
          { _id: imFollowing },
          { $pull: { followers: whoseFollowing } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed Successfully",
        success: true,
      });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: whoseFollowing },
          { $push: { following: imFollowing } }
        ),
        User.updateOne(
          { _id: imFollowing },
          { $push: { followers: whoseFollowing } }
        ),
      ]);
      return res.status(200).json({
        message: "following Successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const bookmarks = async (req, res) => {
  try {
    const userId = req.id;
    const eventId = req.params.postId; // better rename to eventId for clarity

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // Toggle bookmark
    const isBookmarked = user.bookmarks.includes(eventId);
    if (isBookmarked) {
      user.bookmarks.pull(eventId);
      await user.save();
      return res.json({ success: true, message: "Bookmark removed" });
    } else {
      user.bookmarks.push(eventId);
      await user.save();
      return res.json({ success: true, message: "Bookmarked successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("bookmarks");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({
      success: true,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

