import Post from "../models/Post.js";
import cloudinary from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      text: req.body.text,
      image: imageUrl,
      user: req.user.id
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
