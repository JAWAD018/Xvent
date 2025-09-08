import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Layout
import NavbarDesktop from "./components/Navbar/NavbarDesktop";
import Footer from "./components/Footer/Footer";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import Legal from "./pages/PrivacyPolicy/Legal";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import NotFound from "./pages/NotFound/NotFound";
import SignIn from "./pages/Auth/LoginPage/LoginPage";
import SignUp from "./pages/Auth/Signuppage/SignupPage";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import SignupPage from "./pages/Auth/Signuppage/SignupPage";
import Dashbord from "./pages/Dashbord";


const WithLayout = ({ children }) => (
  <div className="app-wrapper">
    <NavbarDesktop />
    <main className="main-content">{children}</main>
    {/* <Footer /> */}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <WithLayout>
              <HomePage />
            </WithLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <WithLayout>
              <Legal />
            </WithLayout>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <WithLayout>
              <TermsOfService />
            </WithLayout>
          }
        />
        <Route
          path="*"
          element={
            <WithLayout>
              <NotFound />
            </WithLayout>
          }
        />

        <Route path="/dashboard" element={<Dashbord />} />  
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
