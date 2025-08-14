// import Post from "../models/Post.js";
// import cloudinary from "../config/cloudinary.js";

// export const createPost = async (req, res) => {
//   try {
//     let imageUrl = "";
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//     }

//     const post = await Post.create({
//       text: req.body.text,
//       image: imageUrl,
//       user: req.user.id
//     });

//     res.status(201).json(post);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().populate("user", "name email");
//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Create a post
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

// @desc    Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like / Unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
