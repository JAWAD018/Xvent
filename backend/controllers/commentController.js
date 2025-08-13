import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const comment = await Comment.create({
      text,
      post: postId,
      user: req.user.id
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(id);

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
