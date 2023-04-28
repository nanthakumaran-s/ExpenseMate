import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./route/PrivateRoute";
import Authenticate from "./pages/Authenticate";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
