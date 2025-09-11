import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bookmark, CalendarDays, MapPin, Heart } from "lucide-react";
import { useUser } from "../context/UserContext";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

const EventsPage = () => {
  const { currentUser } = useUser();
  const currentUserId = currentUser?._id;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({}); // for each event
  const [expandedComments, setExpandedComments] = useState({}); // track expanded comments per event

  const fetchEvents = async () => {
    try {
      const res = await api.get("/event/all");
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // BookMarked Handler
  const handleBookmark = async (id) => {
    try {
      await api.post(`/event/${id}/bookmark`);
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to bookmark event");
    }
  };

  const handleLikeToggle = async (event) => {
    if (!currentUserId) return toast.error("Please login to like events");

    const isLiked = event.likes?.includes(currentUserId);
    try {
      setEvents((prev) =>
        prev.map((e) =>
          e._id === event._id
            ? {
                ...e,
                likes: isLiked
                  ? e.likes.filter((id) => id !== currentUserId)
                  : [...(e.likes || []), currentUserId],
              }
            : e
        )
      );

      await api.post(`/event/${event._id}/${isLiked ? "dislike" : "like"}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update like");
      fetchEvents();
    }
  };

  const handleComment = async (event) => {
    const text = commentInputs[event._id]?.trim();
    if (!text) return toast.error("Comment cannot be empty");
    if (!currentUserId) return toast.error("Please login to comment");

    try {
      const res = await api.post(`/event/${event._id}/comment`, { text });
      toast.success("Comment added!");
      setCommentInputs((prev) => ({ ...prev, [event._id]: "" }));
      setEvents((prev) =>
        prev.map((e) =>
          e._id === event._id
            ? { ...e, comments: [...(e.comments || []), res.data.comment] }
            : e
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to add comment");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading events...</div>;

  return (
    <div className="p-8 max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => {
        const isLiked = event.likes?.includes(currentUserId);

        const commentsToShow = expandedComments[event._id]
          ? event.comments
          : event.comments?.slice(-2) || [];

        return (
          <div
            key={event._id}
            className="bg-[#FAF9F2] text-black p-5 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between"
          >
            {/* Image */}
            {event.image && (
              <img
                src={event.image}
                alt={event.title || "Event Image"}
                className="w-full h-60 rounded-xl border border-[#E1E1DA] object-cover mb-4"
              />
            )}

            {/* Event Info */}
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-lg font-bold">{event.title || "No Title"}</h2>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin /> <span>{event.venue || "No Location"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CalendarDays />
                <span>
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-auto">
              {/* Like */}
              <button
                onClick={() => handleLikeToggle(event)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                  isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                <Heart className="w-5 h-5" /> {event.likes?.length || 0}
              </button>

              {/* Comment Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[event._id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [event._id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleComment(event);
                    }
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Bookmark */}
              <button
                onClick={() => handleBookmark(event._id)}
                className="p-2 bg-gray-400 rounded-full hover:bg-gray-600 transition"
              >
                <Bookmark className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Comments */}
            {event.comments?.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                {commentsToShow.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-2 py-1 border-b border-gray-200">
                    {/* Profile Picture */}
                    {comment.user?.profilePicture ? (
                      <img
                        src={comment.user.profilePicture}
                        alt={comment.user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        {comment.user?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}

                    {/* Comment text */}
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{comment.user?.username || "Unknown"}:</span>{" "}
                        {comment.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {event.comments.length > 2 && !expandedComments[event._id] && (
                  <div
                    className="text-xs text-gray-400 mt-1 cursor-pointer hover:underline"
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [event._id]: true,
                      }))
                    }
                  >
                    +{event.comments.length - 2} more comments
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EventsPage;
