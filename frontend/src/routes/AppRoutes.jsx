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
import Coding from "../pages/Coding";
import MySubmissions from "../pages/MySubmissions";
import AdminSubmissions from "../pages/AdminSubmissions";
import CodingLeaderboard from "../pages/CodingLeaderboard";

import AdminDashboard from "../pages/AdminDashboard";
import AdminQuestions from "../pages/AdminQuestions";
import AdminUsers from "../pages/AdminUsers";
import AdminCodingQuestions from "../pages/AdminCodingQuestions";

import Notes from "../pages/Notes";
import AdminNotes from "../pages/AdminNotes";
import StudentProfile from "../pages/StudentProfile";
import AdminProfiles from "../pages/AdminProfiles";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Routes */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
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
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <AptitudeHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/coding"
                    element={
                        <ProtectedRoute>
                            <Coding />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-submissions"
                    element={
                        <ProtectedRoute>
                            <MySubmissions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/submissions"
                    element={
                        <ProtectedRoute>
                            <AdminSubmissions />
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
                    path="/coding-leaderboard"
                    element={
                        <ProtectedRoute>
                            <CodingLeaderboard />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/profile"
    element={
        <ProtectedRoute>
            <StudentProfile />
        </ProtectedRoute>
    }
/>
                <Route
    path="/notes"
    element={
        <ProtectedRoute>
            <Notes />
        </ProtectedRoute>
    }
/>
                <Route
    path="/admin"
    element={
        <ProtectedRoute roleRequired="ADMIN">
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/admin/questions"
                    element={
                        <ProtectedRoute>
                            <AdminQuestions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/admin/profiles"
    element={
        <ProtectedRoute roleRequired="ADMIN">
            <AdminProfiles />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/admin/coding-questions"
                    element={
                        <ProtectedRoute>
                            <AdminCodingQuestions />
                        </ProtectedRoute>
                    }
                />


<Route
    path="/admin/notes"
    element={
        <ProtectedRoute roleRequired="ADMIN">
            <AdminNotes />
        </ProtectedRoute>
    }
/>
                {/* Keep wildcard LAST */}

                <Route
                    path="*"
                    element={<Navigate to="/login" />}
                />

     
            </Routes>

        </BrowserRouter>

    );
}