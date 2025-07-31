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


const WithLayout = ({ children }) => (
  <div className="app-wrapper">
    <NavbarDesktop />
    <main className="main-content">{children}</main>
    <Footer />
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


        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
