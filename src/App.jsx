import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ContactUs from "./pages/ContactUsPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

export default function App() {
  return (
    <>
    <Routes>
      {/* Guest routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
    </>
  );
}