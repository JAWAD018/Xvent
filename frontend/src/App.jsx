import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Layout
import MainLayout from "./Layout/MainLayout";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import Legal from "./pages/PrivacyPolicy/Legal";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import NotFound from "./pages/NotFound/NotFound";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import SignupPage from "./pages/Auth/Signuppage/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./Profile/ProfilePage";
import MyProfilePage from "./Profile/MyProfilePage";

// Context
import { UserProvider } from "./Context/UserContext";
import AddPost from "./components/Post/AddPost";
import MyPosts from "./components/Post/MyPosts";
import UpdatePost from "./components/Post/UpdatedPost";
import AddEventPost from "./EventPost/AddEventPost";
import EventsPage from "./EventPost/EventsPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Routes with Layout (nav auto switches between guest / logged-in) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-policy" element={<Legal />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/my-post" element={<MyPosts />} />
            <Route path="/add-event" element={<AddEventPost />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/post/updated/:id" element={<UpdatePost />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/me" element={<MyProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth routes WITHOUT layout */}
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
