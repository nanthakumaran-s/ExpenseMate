import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./route/PrivateRoute";
import Authenticate from "./pages/Authenticate";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/Sidebar";
import InvoicePage from "./pages/InvoicePage";
import BudgetPage from "./pages/BudgetPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Sidebar />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
