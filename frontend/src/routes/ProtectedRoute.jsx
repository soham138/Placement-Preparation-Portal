import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, roleRequired }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        if (roleRequired && decoded.role !== roleRequired) {
            return <Navigate to="/dashboard" replace />;
        }

    } catch (err) {
        return <Navigate to="/login" replace />;
    }

    return children;
}