import { Routes, Route, Navigate } from "react-router-dom";

import BaseTemplate from "./base/template";
// import LoginPage from "./pages/login";
import IndexPage from "./pages/index";
import DetectPage from "./pages/detect";
import BatchPage from "./pages/batch";

function App() {
  return <>
    <BaseTemplate>
      <Routes>
        <Route index path="/" element={<IndexPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/detect" element={<DetectPage />} />
        <Route path="/batch" element={<BatchPage />} />

        {/* Page not found */}
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </BaseTemplate>
  </>;
}

export default App;
