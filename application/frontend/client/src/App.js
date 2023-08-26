import { Routes, Route, Navigate } from "react-router-dom";

import BaseTemplate from "./base/template";
import LoginPage from "./pages/login";
import LogoutPage from "./pages/logout";

import IndexPage from "./pages/index";
import DetectPage from "./pages/detect";
import BatchPage from "./pages/batch";
import RetrainPage from "./pages/retrain";

// Database pages
import DatabaseListPage from "./pages/database/list";
import DatabaseAddPage from "./pages/database/add";
import DatabaseViewPage from "./pages/database/view";

function App() {
  return <>
    <BaseTemplate>
      <Routes>
        <Route index path="/" Component={IndexPage} />
        <Route path="/detect" Component={DetectPage} />
        <Route path="/batch" Component={BatchPage} />
        <Route path="/retrain" Component={RetrainPage} />
        <Route path="/database">
          <Route index Component={DatabaseListPage} />
          <Route path="add" Component={DatabaseAddPage} />
          <Route path="view/:id" Component={DatabaseViewPage} />

          {/* Page not found */}
          <Route path="*" element={<Navigate to="" />} />
        </Route>

        <Route path="/login" Component={LoginPage} />
        <Route path="/logout" Component={LogoutPage} />

        {/* Page not found */}
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </BaseTemplate>
  </>;
}

export default App;
