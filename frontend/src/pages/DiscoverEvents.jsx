import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { Loader2, Calendar, MapPin, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiscoverEvents = () => {
  const { currentUser } = useUser(); 
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]); // keep user bookmarks
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchBookmarks();
  }, []);

  // ✅ Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://xvent.onrender.com/api/v1/event/all", {
        withCredentials: true,
      });

      setEvents(data.events || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch bookmarks for current user
  const fetchBookmarks = async () => {
    try {
      const { data } = await axios.get("https://xvent.onrender.com/api/v1/user/bookmarks", {
        withCredentials: true,
      });

      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bookmarks");
    }
  };

  // ✅ Toggle bookmark
  const handleBookmark = async (eventId) => {
    if (!currentUser) return toast.error("Please login to bookmark");

    try {
      const { data } = await axios.post(
        `https://xvent.onrender.com/api/v1/user/bookmark/${eventId}`,
        {},
        { withCredentials: true }
      );

      toast.success(data.message);

      // refresh bookmarks list
      fetchBookmarks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to bookmark event");
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/event/${id}`);
  };

  // Merge events + bookmark state
  const eventsWithBookmark = events.map((event) => ({
    ...event,
    isBookmarked: bookmarks.some((b) => (b._id || b).toString() === event._id.toString()),
  }));

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#FAF9F2] min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Discover Events</h1>

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        </div>
      )}

      {!loading && eventsWithBookmark.length === 0 && (
        <p className="text-center text-gray-500">No events found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 justify-items-center">
        {eventsWithBookmark.map((event) => (
          <div
            key={event._id}
            className="bg-[#FAF9F2] w-80 h-98 md:w-60 md:h-102 rounded-xl border border-[#E1E1DA] p-4 flex flex-col justify-between transition"
          >
            <div>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-44 object-cover rounded-md mt-3"
                />
              )}

              <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 break-words">
                {event.title || "Title"}
              </h2>

              <p className="text-sm text-[#000000] mb-2">{event.category || "#general"}</p>

              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 opacity-50" />
                <p className="text-sm pl-2 text-gray-600">{event.venue}</p>
              </div>

              <div className="flex items-center text-gray-500 text-xs gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(event.date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(/ /g, "-")
                    .toLowerCase()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleBookmark(event._id)}
                  className={`flex items-center gap-1 px-1 py-1 rounded-full text-sm ${
                    event.isBookmarked ? "bg-green-800 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Bookmark className="w-4 h-4" /> {event.isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                <button
                      onClick={() => handleViewDetails(event._id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverEvents;
