import { Navigate } from 'react-router';
import { isUserAuthenticated } from '../utils/storageUtils';

function ProtectedRoute({ children }) {
  if (!isUserAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;