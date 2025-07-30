import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Layout
import NavbarGuest from "./components/Navbar/NavbarGuest";
import Footer from "./components/Footer/Footer";

// Pages
import HomePage from "./pages/HomePage/HomePage";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService/TermsOfService";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <NavbarGuest />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
