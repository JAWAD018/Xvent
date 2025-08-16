// // src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Feed from "./components/Feed";
// import DiscoverEvents from "./components/DiscoverEvents";
// import Profile from "./components/Profile";
// import Sidebar from "./components/Sidebar";
// import Rightbar from "./components/Rightbar";
// import Header from "./components/Header";

// // Home Page (Feed)
// const Home = () => {
//   const [posts, setPosts] = React.useState([]);

//   React.useEffect(() => {
//     // Fetch posts from backend
//     axios
//       .get("/api/posts/feed", {
//         headers: {
//           "x-auth-token": localStorage.getItem("token"),
//         },
//       })
//       .then((res) => {
//         console.log(res.data); // 👈 Check the shape
//         setPosts(res.data.posts || res.data); // Adjust based on actual response
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="mt-16 p-4">
//       <CreatePost /> {/* Post creation form */}
//       <CreateEvent /> {/* Event creation button/form */}
//       {Array.isArray(posts) &&
//         posts.map((post) => (
//           <div key={post._id} className="bg-white p-4 rounded-lg mb-4 shadow">
//             <p>
//               {post.user} - {post.time}
//             </p>
//             <p>{post.description}</p>
//             <img src={post.image} alt="Post" className="w-full" />
//             <div className="flex space-x-4">
//               <button>❤️ {post.likes}</button>
//               <button>💬 {post.comments}</button>
//               <button>🔖 Save</button>
//               <button>🔗 Share</button>
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// };

// // Create Post Component (with schema)
// const CreatePost = () => {
//   const [description, setDescription] = React.useState("");
//   const [image, setImage] = React.useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Post to backend: FormData for image
//     const formData = new FormData();
//     formData.append("text", description); // Backend expects 'text'
//     if (image) formData.append("image", image);
//     axios
//       .post("/api/posts", formData, {
//         headers: {
//           "x-auth-token": localStorage.getItem("token"),
//           "Content-Type": "multipart/form-data"
//         }
//       })
//       .then((res) => console.log("Posted!", res))
//       import React from "react";
//       import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//       import Feed from "./components/Feed";
//       import DiscoverEvents from "./components/DiscoverEvents";
//       import Profile from "./components/Profile";
//       import Sidebar from "./components/Sidebar";
//       import Rightbar from "./components/Rightbar";
//       import Header from "./components/Header";

//       const App = () => {
//         return (
//           <Router>
//             <Header />
//             <div className="flex">
//               <Sidebar />
//               <main className="flex-1 ml-1/5 mr-1/5 mt-16">
//                 <Routes>
//                   <Route path="/" element={<Feed />} />
//                   <Route path="/discover" element={<DiscoverEvents />} />
//                   <Route path="/profile" element={<Profile />} />
//                   {/* Add more routes as needed */}
//                 </Routes>
//               </main>
//               <Rightbar />
//             </div>
//           </Router>
//         );
//       };

//       export default App;

// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";


import Feed from "./components/Feed";
import DiscoverEvents from "./components/DiscoverEvents";
import Profile from "./components/Profile";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import Header from "./components/Header";
import Login from "./components/Login";
import CreateEvent from "./components/CreateEvent";
import Register from "./components/Register";
// import CreateEvent from "./components/CreateEvent"; // 👈 assuming you have this

// ---------- Home Page (Feed) ----------
const Home = () => {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/posts/feed", {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data); // 👈 check shape
        setPosts(res.data.posts || res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mt-16 p-4 md:w-1/2 relative left-1/4">
      <CreatePost /> {/* Post creation form */}
      {/* <CreateEvent /> Event creation button/form */}

      {Array.isArray(posts) &&
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded-lg mb-4 shadow">
            <p>
              {post.user} - {post.time}
            </p>
            <p>{post.description}</p>
            {post.image && (
              <img src={post.image} alt="Post" className="w-full" />
            )}
            <div className="flex space-x-4 mt-2">
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

// ---------- Create Post Component ----------
const CreatePost = () => {
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", description); // backend expects 'text'
    if (image) formData.append("image", image);

    axios
      .post("/api/posts", formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Posted!", res);
        setDescription("");
        setImage(null);
      })
      .catch((err) => console.error(err));
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

// ---------- App Root ----------
const App = () => {
  return (
    <Router>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex justify-center items-start mt-16">
          <div className="w-full max-w-2xl">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/discover" element={<DiscoverEvents />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create-event" element={<CreateEvent />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </main>
        <Rightbar />
      </div>
    </Router>
  );
};

export default App;
