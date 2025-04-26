import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import HomePage from "./components/Pages/Home";
import ProtectedRoute from "./components/Pages/ProtectRoutes";
import AdminHomePage from "./components/Admin/AdminHomePage";
import AdminLoginPage from "./components/Admin/AdminLoginPage";
import AdminProtectedRoute from "./components/Admin/AdminRoutpr";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route element={<AdminProtectedRoute />}>
      </Route>
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/ad-login" element={<AdminLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;