import { Routes, Route, Navigate } from "react-router-dom";

import BaseTemplate from "./base/template";
import IndexPage from "./pages/index";
import DetectPage from "./pages/detect";

function App() {
  return <>
    <BaseTemplate>
      <Routes>
        <Route index path="/" element={<IndexPage />} />
        <Route path="/detect" element={<DetectPage />} />

        {/* Page not found */}
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </BaseTemplate>
  </>;
}

export default App;
