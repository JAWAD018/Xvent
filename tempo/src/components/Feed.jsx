
import React from "react";
import axios from "axios";
import PostCard from "./PostCard";

const CreatePost = () => {
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", description);
    if (image) formData.append("image", image);
    axios
      .post("/api/posts", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setDescription("");
        setImage(null);
        window.location.reload(); // Quick refresh to show new post
      })
      .catch(() => alert("Error creating post"));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="What's on your mind?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </form>
  );
};

const Feed = () => {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/posts/feed", {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([
        {
          _id: '1',
          text: 'Welcome to Xvent! This is a sample post.',
          image: '',
          createdAt: new Date().toISOString(),
          likes: [],
          comments: [],
        },
      ]));
  }, []);

  return (
    <div className="mt-16 p-4">
      <h2 className="text-2xl font-bold mb-4">Feed</h2>
      <CreatePost />
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
