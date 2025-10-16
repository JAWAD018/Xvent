import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { Loader2, Calendar, MapPin, Bookmark, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const EventDetails = () => {
  const { currentUser } = useUser();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvent();
    if (currentUser) checkBookmark();
  }, [id, currentUser]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/v1/event/${id}`, {
        withCredentials: true,
      });
      setEvent(data.event);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/user/bookmarks", {
        withCredentials: true,
      });
      setIsBookmarked(data.bookmarks.some((b) => (b._id || b) === id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) return toast.error("Please login to bookmark");

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/user/bookmark/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      console.error(err);
      toast.error("Failed to bookmark event");
    }
  };

  const handleRegister = () => {
    if (!currentUser) {
      toast.error("Please login to register");
      return;
    }
    toast.success("Registration feature coming soon!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  if (!event) 
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FAF9F2]">
        <p className="text-gray-500 text-lg">Event not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF9F2]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-[#FAF9F2] rounded-2xl shadow-sm overflow-hidden">
          {event.image && (
            <div className="w-full h-80  bg-gray-200">
              <img
                src={event.image}
                alt={event.title || "Event"}
                className="w-full h-full rounded-2xl  object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.title || "Event Title"}
            </h1>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date and time</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    {event.time && ` · ${event.time}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">{event.venue}</p>
                  {event.address && (
                    <a href="#" className="text-blue-500 text-sm hover:underline">
                      Map
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleRegister}
                className="bg-[#FB432C] hover:bg-[#f52a10] text-white px-6 py-2.5 rounded-4xl font-medium transition-colors"
              >
                Register
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-4xl font-medium transition-colors ${
                  isBookmarked
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description || "No description available."}
              </p>
            </div>

            {event.organizer && (
              <div className="border-t mt-6 pt-6">
                <p className="text-sm text-gray-500">
                  Organized by <span className="font-medium text-gray-900">{event.organizer}</span>
                </p>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          © 2025 Event Platform · Terms & Conditions · Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default EventDetails;