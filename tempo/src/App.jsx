// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios"; // For API calls (mocked for now)

// Placeholder components (create these in src/components/ or src/pages/)
const Sidebar = () => (
  <div className="w-1/5 bg-gray-100 p-4 fixed left-0 top-0 h-full">
    <ul className="space-y-4">
      <li>
        <Link to="/" className="flex items-center">
          <span className="mr-2">🏠</span>Home
        </Link>
      </li>
      <li>
        <Link to="/discover" className="flex items-center">
          <span className="mr-2">🔍</span>Discover Events
        </Link>
      </li>
      <li>
        <Link to="/bookmarks" className="flex items-center">
          <span className="mr-2">🔖</span>Bookmarks
        </Link>
      </li>
      <li>
        <Link to="/profile" className="flex items-center">
          <span className="mr-2">👤</span>Profile
        </Link>
      </li>
      <li>
        <Link to="/help" className="flex items-center">
          <span className="mr-2">❓</span>Help
        </Link>
      </li>
      <li>
        <Link to="/settings" className="flex items-center">
          <span className="mr-2">⚙️</span>Settings
        </Link>
      </li>
    </ul>
    <div className="mt-8">
      <img
        src="profile-pic-placeholder.jpg"
        alt="User"
        className="w-8 h-8 rounded-full"
      />
      <p>Sadiq Mehdi</p> {/* Mock user */}
    </div>
  </div>
);

const Rightbar = () => (
  <div className="w-1/5 bg-gray-100 p-4 fixed right-0 top-0 h-full">
    <h3 className="font-bold">Top Events</h3>
    <ul className="space-y-2">
      <li>Music Bash #music</li>
      <li>Design Expo #arts</li>
      <li>Tech Summit #technology</li>
      {/* Fetch from API: useEffect to load events */}
    </ul>
    <h3 className="font-bold mt-4">New Events</h3>
    <ul className="space-y-2">
      <li>Released a new version. 59 minutes ago</li>
      {/* Notifications placeholder */}
    </ul>
    <h3 className="font-bold mt-4">This Week</h3>
    <ul className="space-y-2">
      <li>Music Bash - 3 days left</li>
      {/* Countdown logic can be added */}
    </ul>
  </div>
);

const Header = () => (
  <header className="bg-white p-4 flex justify-between items-center fixed top-0 w-full z-10">
    <h1 className="text-orange-500 text-2xl">Xvent</h1>
    <div className="flex items-center space-x-4">
      <select className="border p-1">
        <option>Hyderabad</option>
      </select>
      <input
        type="search"
        placeholder="Search..."
        className="border p-1 w-64"
      />
      <span>☀️ 🔔 👤</span> {/* Icons for theme, notifications, profile */}
    </div>
  </header>
);

// Home Page (Feed)
const Home = () => {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    // Fetch posts from backend
    axios
      .get("/api/posts/feed", {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data); // 👈 Check the shape
        setPosts(res.data.posts || res.data); // Adjust based on actual response
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-16 p-4">
      <CreatePost /> {/* Post creation form */}
      <CreateEvent /> {/* Event creation button/form */}
      {Array.isArray(posts) &&
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg mb-4 shadow">
            <p>
              {post.user} - {post.time}
            </p>
            <p>{post.description}</p>
            <img src={post.image} alt="Post" className="w-full" />
            <div className="flex space-x-4">
              <button>❤️ {post.likes}</button>
              <button>💬 {post.comments}</button>
              <button>🔖 Save</button>
              <button>🔗 Share</button>
            </div>
          </div>
        ))}
    </div>
  );
};

// Create Post Component (with schema)
const CreatePost = () => {
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Post to backend: FormData for image
    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);
    axios
      .post("/api/posts", formData)
      .then((res) => console.log("Posted!", res))
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg mb-4 shadow md:w-1/2 items-center justify-center flex flex-col relative left-1/4"
    >
      <textarea
        placeholder="Let others know what's going on..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </form>
  );
};

// Create Event Component (with schema)
const CreateEvent = () => {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    organizer: "",
    category: "",
    type: "In-Person",
    tags: "",
    registrationLink: "",
    banner: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, banner: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Post to backend
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    axios
      .post("/api/events", data)
      .then((res) => console.log("Event Created!",res))
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg mb-4 shadow md:w-1/2 relative left-1/4"
    >
      <input
        name="title"
        placeholder="Event Title"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="date"
        type="date"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="time"
        type="time"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="venue"
        placeholder="Venue"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="organizer"
        placeholder="Organizer"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <select
        name="category"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      >
        <option>Music</option>
        <option>Tech</option>
        <option>Business</option>
      </select>
      <select
        name="type"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      >
        <option>In-Person</option>
        <option>Online</option>
        <option>Hybrid</option>
      </select>
      <input
        name="tags"
        placeholder="Tags (optional)"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />
      <input
        name="registrationLink"
        placeholder="Link for Registration"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      />
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Publish Event
      </button>
    </form>
  );
};

// Profile Page (with followers/following)
const Profile = () => {
  const [user, setUser] = React.useState({ followers: [], following: [] });

  React.useEffect(() => {
    // Fetch from backend
    axios
      .get("/api/user/profile")
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-16 p-4">
      <h2>Profile</h2>
      <img
        src="profile-pic.jpg"
        alt="Profile"
        className="w-32 h-32 rounded-full"
      />
      <p>Username: {user.username}</p>
      <h3>Followers ({user.followers.length})</h3>
      <ul>
        {user.followers.map((f) => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>
      <h3>Following ({user.following.length})</h3>
      <ul>
        {user.following.map((f) => (
          <li key={f.id}>{f.name}</li>
        ))}
      </ul>
      {/* Add buttons to follow/unfollow, fetch posts/events by user */}
    </div>
  );
};

// Login Page
const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/auth/login", { email, password })
      .then((res) => {
        // Save token to localStorage, redirect to home
        localStorage.setItem("token", res.data.token);
        window.location.href = "/";
      })
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-16 p-4 max-w-md mx-auto bg-white shadow rounded"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-2"
        required
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
};

// Register Page (similar to Login, with extra fields)
const Register = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/auth/register", formData)
      // .post("http://localhost:5000/api/auth/register", formData)
      .then((res) => {
        // Redirect to login
        console.log(res);
        window.location.href = "/login";
      })
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-16 p-4 max-w-md mx-auto bg-white shadow rounded"
    >
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full border p-2 mb-2"
        required
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
};

// Discover Events (placeholder)
const DiscoverEvents = () => (
  <div className="mt-16 p-4">
    <h2>Discover Events</h2>
    {/* Grid of event cards, fetch from /api/events */}
    <div className="grid grid-cols-3 gap-4">{/* Map events here */}</div>
  </div>
);

// Bookmarks (placeholder)
const Bookmarks = () => (
  <div className="mt-16 p-4">
    <h2>Bookmarks</h2>
    {/* List saved posts/events, fetch from /api/bookmarks */}
  </div>
);

// Help (FAQ + Contact)
const Help = () => (
  <div className="mt-16 p-4">
    <h2>Frequently Asked Questions</h2>
    {/* Accordion style FAQs from screenshot */}
    <h2>Contact Us</h2>
    <form>{/* Name, Email, Subject, Message */}</form>
  </div>
);

// Settings (placeholder)
const Settings = () => (
  <div className="mt-16 p-4">
    <h2>Settings</h2>
    {/* Profile update, privacy, etc. */}
  </div>
);

const App = () => {
  return (
    <Router>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-1/5 mr-1/5 mt-16">
          {" "}
          {/* Center content */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<DiscoverEvents />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Add event detail route: /event/:id */}
          </Routes>
        </main>
        <Rightbar />
      </div>
    </Router>
  );
};

export default App;
