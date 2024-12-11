import { Routes, Route } from "react-router-dom";

import "./index.css";
import AuthLayout from "./_auth/AuthLayout";
import Signup from "./_auth/register/Signup";
import RootLayout from "./_root/RootLayout";
import { Home } from "./_root/pages/index";

function App() {
  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path={"/register"} element={<Signup />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
