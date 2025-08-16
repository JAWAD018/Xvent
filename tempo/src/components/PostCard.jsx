import React from "react";

const PostCard = ({ post }) => (
  <div className="bg-white p-4 rounded shadow mb-4">
    <p className="font-semibold">{post.text}</p>
    {post.image && <img src={post.image} alt="Post" className="w-full mt-2" />}
    <p className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleString()}</p>
    <div className="flex space-x-4 mt-2">
      <button>❤️ {post.likes?.length || 0}</button>
      <button>💬 {post.comments?.length || 0}</button>
      <button>🔖 Save</button>
      <button>🔗 Share</button>
    </div>
  </div>
);

export default PostCard;
