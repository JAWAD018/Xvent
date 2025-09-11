import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { Loader2, Image, Camera } from "lucide-react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  PlusSquare,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Post/PostCard";

const Dashboard = () => {
  const { currentUser } = useUser();
  const currentUserId = currentUser?._id;
  const navigate = useNavigate();

  // Feed
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comments
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

  // Mode To change Post NAD event
  const [mode, setMode] = useState("post");

  // Post Form
  const [caption, setCaption] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  // Event Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("In-Person");
  const [tags, setTags] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/post/all", {
        withCredentials: true,
      });
      setPosts(data.posts || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  //Post Handler
  const handlePostImageChange = (e) => setPostImage(e.target.files[0]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postImage) {
      toast.error("Please select an image");
      return;
    }
    try {
      setPostLoading(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", postImage);

      const res = await axios.post("http://localhost:8000/api/v1/post/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("✅ Post created successfully!");
        setCaption("");
        setPostImage(null);
        setPosts(prev => [res.data.post, ...prev]); // prepend new post
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "❌ Failed to add post");
    } finally {
      setPostLoading(false);
    }
  };

  // Event Handler
  const handleEventImageChange = (e) => setEventImage(e.target.files[0]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (!eventImage || !title || !venue || !date || !time || !category || !organizer) {
      toast.error("Please fill all required fields and select an image");
      return;
    }

    try {
      setEventLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("venue", venue);
      formData.append("organizer", organizer);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("tags", tags);
      formData.append("registrationLink", registrationLink);
      formData.append("image", eventImage);

      const res = await axios.post("http://localhost:8000/api/v1/event/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("✅ Event created successfully!");
        setTitle(""); setDescription(""); setVenue(""); setOrganizer(""); setDate("");
        setTime(""); setCategory(""); setType("In-Person"); setTags(""); setRegistrationLink(""); setEventImage(null);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "❌ Failed to create event");
    } finally {
      setEventLoading(false);
    }
  };


  const handleLikeToggle = async (postId, isLiked) => {
    if (!currentUserId) return toast.error("Please login to like posts");
    try {
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, likes: isLiked ? post.likes.filter(id => String(id) !== String(currentUserId)) : [...post.likes, currentUserId] }
            : post
        )
      );
      const endpoint = isLiked ? "dislike" : "like";
      await axios.put(`http://localhost:8000/api/v1/post/${postId}/${endpoint}`, {}, { withCredentials: true });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      fetchPosts();
    }
  };

  const handleShare = (post) => {
    const url = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      navigator.share({ title: post.caption || "Check this out!", text: post.caption || "", url }).catch(err => console.error(err));
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Post link copied to clipboard!");
    }
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return toast.error("Comment cannot be empty");
    if (!currentUserId) return toast.error("Please login to comment");

    try {
      const { data } = await axios.post(`http://localhost:8000/api/v1/post/${postId}/comment`, { text }, { withCredentials: true });
      toast.success("Comment added!");
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      setPosts(prev => prev.map(post => post._id === postId ? { ...post, comments: [...post.comments, data.comment] } : post));
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="max-w-4xl bg-[#FAF9F2] mx-auto p-4">
      {/* Toggle Buttons */}
      <div className="flex justify-around mb-4 text-gray-600">
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition" onClick={() => setMode("post")}>
          <PlusSquare className="w-5 h-5 text-blue-500" />
          Post
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition" onClick={() => setMode("event")}>
          <Calendar className="w-5 h-5 text-green-500" />
          Event
        </button>
      </div>

      {/* POST FORM */}
      {currentUser && mode === "post" && (
        <div className="bg-[#F0EFE9]  rounded-2xl shadow-sm border-none p-4 mb-8">
          <div className="flex items-center gap-3">
           <img
  src={currentUser?.profilePicture || "/default-profile.png"} 
  alt="profile"
  className="w-12 h-12 rounded-full"
/>
            <form onSubmit={handlePostSubmit} className="space-y-4 flex-1">
              <textarea
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                placeholder="Let others know what's going on..."
                  className="w-full flex-1 resize-none border-b border-gray-300 p-5 focus:border-black focus:ring-0 focus:outline-none overflow-hidden"
  rows={1}
              />
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-[#FB432C] transition">
                  <Image className="w-6 h-6" />
                  <input type="file" accept="image/*" onChange={handlePostImageChange} className="hidden" />
                </label>
                {postLoading ? (
                  <button disabled className="bg-[#FB432C] text-white py-2 px-4 rounded-lg flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2 w-4 h-4" /> Posting...
                  </button>
                ) : (
                  <button type="submit" className="bg-[#FB432C]/85 hover:bg-[#FB432C] text-white py-2 px-4 rounded-lg font-medium">Post</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT FORM */}
      {currentUser && mode === "event" && (
<div className="bg-[#F0EFE9] rounded-xl shadow-md p-6 max-w-2xl mb-10 mx-auto">
  <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Event</h2>
  <form onSubmit={handleEventSubmit} className="space-y-4">

    {/* Event Title */}
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Event Title"
      className="w-full border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
      required
    />

    {/* Description */}
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Description"
      className="w-full border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
      rows={2}
    />

    {/* Date & Time */}
    <div className="flex gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="flex-1 border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="flex-1 border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    {/* Venue & Organizer */}
    <div className="flex gap-2">
      <input
        type="text"
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
        placeholder="Venue"
        className="flex-1 border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
        required
      />
      <input
        type="text"
        value={organizer}
        onChange={(e) => setOrganizer(e.target.value)}
        placeholder="Organizer"
        className="flex-1 border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
        required
      />
    </div>

    {/* Category */}
    <input
      type="text"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      placeholder="Category"
      className="w-full border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
      required
    />

    {/* Event Type Toggle */}
    <p className="text-sm text-gray-600 mt-2 mb-1">Event Type</p>
    <div className="flex gap-2">
      {["In-Person", "Online", "Hybrid"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setType(opt)}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition ${
            type === opt
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>

    {/* Tags & Registration */}
    <input
      type="text"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      placeholder="Tags (optional)"
      className="w-full border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
    />
    <input
      type="url"
      value={registrationLink}
      onChange={(e) => setRegistrationLink(e.target.value)}
      placeholder="Link for registration"
      className="w-full border-b border-gray-400 bg-transparent p-2 text-sm focus:outline-none focus:border-blue-500"
    />

    {/* Image Upload */}
    <label className="flex items-center gap-2 p-2  cursor-pointer text-gray-700 text-sm">
      <Camera className="w-5 h-5 " />
      <span className=" border-b border-gray-400"> Event banner</span>
      <input
        type="file"
        accept="image/*"
        onChange={handleEventImageChange}
        className="hidden"
      />
    </label>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-[#FB432C]/85 hover:bg-[#FB432C] text-white py-2 rounded-full font-medium mt-4"
      disabled={eventLoading}
    >
      {eventLoading ? "Posting..." : "Publish"}
    </button>
  </form>
</div>


      )}

      {/* ---------- FEED ---------- */}
      {loading && <p className="text-center text-gray-500">Loading posts...</p>}
      {!loading && posts.length === 0 && <p className="text-center text-gray-500">No posts available yet.</p>}

    <div className="flex flex-col gap-6">
  {posts.map(post => (
<PostCard
  key={post._id}
  post={post}
  currentUserId={currentUserId}
  handleLikeToggle={handleLikeToggle}
  handleShare={handleShare}
/>

  ))}
</div>
    </div>
  );
};

export default Dashboard;
