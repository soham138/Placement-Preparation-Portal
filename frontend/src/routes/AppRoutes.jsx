import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Aptitude from "../pages/Aptitude";
import Practice from "../pages/Practice";
import AptitudeHistory from "../pages/AptitudeHistory";
import Leaderboard from "../pages/Leaderboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
    path="/history"
    element={
        <ProtectedRoute>
            <AptitudeHistory />
        </ProtectedRoute>
    }
/>

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
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
        <Route
    path="/leaderboard"
    element={
        <ProtectedRoute>
            <Leaderboard />
        </ProtectedRoute>
    }
/>
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>


    </BrowserRouter>
  );
}