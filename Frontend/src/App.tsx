import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Blog from "@components/Blog";
import SignUp from "@components/auth/SignUp";
import SignIn from "@components/auth/SignIn";
import ForgetPassword from "@components/auth/ForgetPassword";
import EmailVerification from "@components/auth/EmailVerification";
import ConfirmPassword from "@components/auth/ConfirmPassword";
import Dashboard from "@components/Dashboard";
import CreateBlog from "@components/CreateBlog";
import UpdateBlog from "@components/UpdateBlog";
import BlogSearch from "@components/BlogSearch";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route
          path="/auth/email-verification"
          element={<EmailVerification />}
        />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog/:blogId" element={<Blog />} />
        <Route path="/blog/create" element={<CreateBlog />} />
        <Route path="/blog/update/:blogId" element={<UpdateBlog />} />
        <Route path="/blog/search/" element={<BlogSearch />} />
      </Routes>
    </>
  );
}
