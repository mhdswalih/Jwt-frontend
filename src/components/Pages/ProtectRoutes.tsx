// components/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../Redux/redux-store.';

const ProtectedRoute = () => {
  const  user  = useSelector((state: RootState) => state.login.user);
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;