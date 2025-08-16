import React from "react";
import axios from "axios";
import PostCard from "./PostCard";
import EventCard from "./EventCard";
import LogoutButton from "./LogoutButton";

const Profile = () => {
  const [user, setUser] = React.useState({ followers: [], following: [] });
  const [posts, setPosts] = React.useState([]);
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/profiles/", {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setPosts(res.data.posts || []);
          setEvents(res.data.events || []);
        } else {
          setUser(res.data);
        }
      })
      .catch(() => {
        setUser({ name: "Guest", email: "-", followers: [], following: [] });
        setPosts([]);
        setEvents([]);
      });
  }, []);

  const tempPosts = [
    { _id: '1', text: 'Welcome to Xvent! This is a sample post.', image: '', createdAt: new Date().toISOString() },
  ];
  const tempEvents = [
    { _id: '1', title: 'Sample Event', date: new Date().toISOString(), venue: 'Hyderabad', banner: '', description: 'This is a sample event.' },
  ];

  return (
    <div className="mt-16 p-4">
      <h2 className="text-2xl font-bold mb-2">Profile</h2>
      <img
        src={user.avatar || "profile-pic.jpg"}
        alt="Profile"
        className="w-32 h-32 rounded-full mb-2"
      />
      <p className="text-lg font-semibold">Name: {user.name || user.username || "-"}</p>
      <p className="text-md">Email: {user.email || "-"}</p>
      <div className="flex gap-8 my-2">
        <div>
          <span className="font-bold">Followers:</span> {Array.isArray(user.followers) ? user.followers.length : 0}
        </div>
        <div>
          <span className="font-bold">Following:</span> {Array.isArray(user.following) ? user.following.length : 0}
        </div>
      </div>
      <LogoutButton />
      <h3 className="text-xl font-bold mt-6 mb-2">Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(posts.length ? posts : tempPosts).map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <h3 className="text-xl font-bold mt-6 mb-2">Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(events.length ? events : tempEvents).map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
