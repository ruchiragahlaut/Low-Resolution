import { Routes, Route, Navigate } from "react-router-dom";

import BaseTemplate from "./base/template";
import LoginPage from "./pages/login";
import LogoutPage from "./pages/logout";

import IndexPage from "./pages/index";
import DetectPage from "./pages/detect";
import BatchPage from "./pages/batch";

function App() {
  return <>
    <BaseTemplate>
      <Routes>
        <Route index path="/" Component={IndexPage} />
        <Route path="/detect" Component={DetectPage} />
        <Route path="/batch" Component={BatchPage} />

        <Route path="/login" Component={LoginPage} />
        <Route path="/logout" Component={LogoutPage} />

        {/* Page not found */}
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </BaseTemplate>
  </>;
}

export default App;
