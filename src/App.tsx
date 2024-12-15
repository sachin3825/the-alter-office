import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";
import AuthLayout from "./_auth/AuthLayout";
import Signup from "./_auth/register/Signup";
import RootLayout from "./_root/RootLayout";
import { Home, CreatePost, Profile, PreviewPost } from "./_root/pages/index";
import ErrorPage from "./_root/pages/ErrorPage";

function App() {
  return (
    <main>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path={"/register"} element={<Signup />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile/:accountId" element={<Profile />} />
          <Route path="/preview-post" element={<PreviewPost />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
