import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../Redux/redux-store.';

const AdminProtectedRoute = () => {
    const accessToken = useSelector((state: RootState) => state.adminLogin.accessToken);
 
  
      return accessToken ? <Outlet /> : <Navigate to="/ad-login" replace />;
    
};

export default AdminProtectedRoute;