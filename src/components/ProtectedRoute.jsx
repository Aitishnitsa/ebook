import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('access_token'); // Check if access token exists

    return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;