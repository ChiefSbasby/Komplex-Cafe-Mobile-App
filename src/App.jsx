import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ContactUs from "./pages/ContactUsPage.jsx";
import CheckoutPage_1 from "./pages/CheckoutPage_1.jsx";

export default function App() {
  return (
    <>
    <Routes>
      {/* Guest routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/checkout/cart" element={<CheckoutPage_1 />} />
    </Routes>
    </>
  );
}