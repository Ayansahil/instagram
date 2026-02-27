import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Wraps protected pages. If the user is not logged in, redirects to /login.
 * Shows nothing (null) while auth status is still being determined.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // Wait for auth check to finish

    if (!user) return <Navigate to="/login" replace />;

    return children;
};

export default ProtectedRoute;
