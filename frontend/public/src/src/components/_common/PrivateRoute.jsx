import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.jsx';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;