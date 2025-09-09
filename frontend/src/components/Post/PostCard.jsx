// PostCard.jsx
import React, { useState } from "react";
import { Heart, BookmarkMinus, MessageCircleMore, Send } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const PostCard = ({ post, currentUserId, handleLikeToggle, handleShare }) => {
  const [openComments, setOpenComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const isLiked = currentUserId && post.likes.some((id) => String(id) === String(currentUserId));

  const handleComment = async () => {
    if (!commentInput.trim()) return toast.error("Comment cannot be empty");
    if (!currentUserId) return toast.error("Please login to comment");

    try {
      const { data } = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text: commentInput }, { withCredentials: true });
      toast.success("Comment added!");
      setCommentInput("");
      post.comments.push(data.comment);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="bg-[#F0EFE9] p-5 rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img src={post.author?.profilePicture} alt="profile" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-gray-800">{post.author?.username}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}</p>
        </div>
      </div>

      {/* Caption */}
      {post.caption && <p className="px-4 text-gray-800 mb-3">{post.caption}</p>}

      {/* Image */}
      {post.image && <img src={post.image} alt={post.caption} className="w-full max-h-96 rounded-xl object-cover" />}

      {/* Actions */}
      <div className="flex justify-between px-4 mt-2 py-3 text-gray-600 text-sm border-t border-gray-200">
        <button onClick={() => handleLikeToggle(post._id, isLiked)} className="flex items-center gap-1 transition">
          <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          <span className={`${isLiked ? "text-red-500" : "text-gray-600"}`}>{post.likes.length}</span>
        </button>
        <button onClick={() => setOpenComments(!openComments)} className="flex items-center gap-1 hover:text-blue-500 transition">
          <MessageCircleMore className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-yellow-500 transition">
          <BookmarkMinus className="w-5 h-5" />
          <span>Save</span>
        </button>
        <button onClick={() => handleShare(post)} className="flex items-center gap-1 hover:text-green-500 transition">
          <Send className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments */}
      {openComments && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="max-h-32 overflow-y-auto mb-2">
            {post.comments.map((comment) => (
              <p key={comment._id} className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">{comment.author?.username}:</span> {comment.text}
              </p>
            ))}
          </div>
          {currentUserId && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleComment(); }}
                className="border p-2 rounded flex-1 text-sm"
              />
              <button onClick={handleComment} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition-colors text-sm">Post</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
