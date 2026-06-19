import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Aptitude from "./pages/Aptitude";
import Practice from "./pages/Practice";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aptitude"
          element={
            <ProtectedRoute>
              <Aptitude />
            </ProtectedRoute>
          }
        />

        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;