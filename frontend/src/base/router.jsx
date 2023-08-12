// import { BrowserRouter as Router } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";

export default function RouterProvider({ children }) {
  return <>
    <Router>
      {children}
    </Router>
  </>;
}
