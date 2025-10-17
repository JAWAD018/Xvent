import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NavbarDesktop from "../components/Navbar/NavbarDesktop";
import NavbarLoggedIn from "../components/Navbar/NavbarLoggedIn";
import { Search, MapPin, LogOut } from "lucide-react";
import axios from "axios";
import HeaderProfileMenu from "../components/HeaderProfileMenu";

const MainLayout = () => {
   const { currentUser, setCurrentUser } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
   

 useEffect(() => {
  if (!currentUser) return;

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://xvent.onrender.com/api/v1/event/all", {
        withCredentials: true,
      });
      console.log("Fetched events:", res.data); // <-- Add this line
      setEvents(Array.isArray(res.data.events) ? res.data.events : []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
      setLoading(false);
    }
  };

  fetchEvents();
}, [currentUser]);


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarDesktop />
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm min-h-96">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

// LogOut
  const handleLogout = async () => {
    try {
      await axios.get("https://xvent.onrender.com/api/v1/user/logout", { withCredentials: true });
      setCurrentUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Process Top Events check login #Jawad find errors logic is weak
const topEvents = [...(events || [])]
  .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  .slice(0, 5)
  .map((event) => ({
    name: event.name,
    category: event.category || "#general",
    color: "bg-purple-500",
  }));


  // Process Recent Activity
  const recentActivities = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map((event) => ({
      action: `${event.authorName || "Someone"} created "${event.name}"`,
      time: new Date(event.createdAt).toLocaleString(),
      color: "bg-blue-500",
    }));

  // This Week Events
  const weekEvents = events
    .filter((event) => {
      if (!event.date) return false;
      const now = new Date();
      const eventDate = new Date(event.date);
      const diffDays = (eventDate - now) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    })
    .slice(0, 5)
    .map((event) => ({
      name: event.name,
      timeLeft: event.date
        ? `${Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))} days left`
        : "N/A",
      color: "bg-green-500",
    }));

  return (
    <div className="min-h-screen bg-[#FAF9F2]">
      {currentUser && <NavbarLoggedIn />}

      <div className={`${currentUser ? "lg-64" : ""} min-h-screen`}>
  {currentUser && (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Location + Search */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">Hyderabad</span>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Right: Profile + Logout */}
          <div className="flex items-center space-x-4 ml-4">
           <HeaderProfileMenu />
          </div>

        </div>
      </div>
    </header>
  )}


        {!currentUser && <NavbarDesktop />}

        <div className="flex">
          <main className={`flex-1 ${currentUser ? "max-w-10xl" : "max-w-10xl mx-auto"} p-6`}>
            <div className="bg-[#FAF9F2] rounded-lg shadow-sm min-h-96">
              <Outlet />
            </div>
          </main>

          {/* Right Sidebar || this will show only to login user  */}
{currentUser && (
  <aside className="w-80 hidden xl:block space-y-6 p-6">

    {/* Top Events Authors */}
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Top Events Authors</h3>
      <div className="space-y-2">
        {[...(events || [])]
          .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
          .slice(0, 5)
          .map((event, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-800">
              <img
                src={event.author?.profilePicture || "/default-avatar.png"}
                alt={event.author?.username || "Unknown"}
                className="w-6 h-6 rounded-full"
              />
              <span>{event.author?.username || "Unknown"}</span>
            </div>
          ))}
      </div>
    </div>

    {/* Recent Activity Authors */}
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Recent Activity Authors</h3>
      <div className="space-y-2">
        {[...(events || [])]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map((event, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-800">
              <img
                src={event.author?.profilePicture || "/default-avatar.png"}
                alt={event.author?.username || "Unknown"}
                className="w-6 h-6 rounded-full"
              />
              <span>{event.author?.username || "Unknown"}</span>
            </div>
          ))}
      </div>
    </div>

    {/* This Week Authors */}
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-4 text-gray-900">This Week Authors</h3>
      <div className="space-y-2">
        {[...(events || [])]
          .filter((event) => {
            if (!event.date) return false;
            const now = new Date();
            const eventDate = new Date(event.date);
            const diffDays = (eventDate - now) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 7;
          })
          .slice(0, 5)
          .map((event, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-800">
              <img
                src={event.author?.profilePicture || "/default-avatar.png"}
                alt={event.author?.username || "Unknown"}
                className="w-6 h-6 rounded-full"
              />
              <span>{event.author?.username || "Unknown"}</span>
            </div>
          ))}
      </div>
    </div>

  </aside>
)}


        </div>
      </div>
    </div>
  );
};

export default MainLayout;
