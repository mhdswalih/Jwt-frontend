import { RootState } from '../../Redux/redux-store.';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/slices/loginSlice';
import { useState } from 'react';
import EditUserModal from '../Modal/UserEditModal';
import { ToastContainer } from 'react-toastify';

const HomePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.login.user);
  const isLoggedIn = useSelector((state: RootState) => state.login);
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleLogout = () => {
     dispatch(logout())
     navigate('/login')
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                My Profile
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  border border-green-600 text-green-600 hover:bg-green-600 hover:text-white
                  shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
  
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* User Profile Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <img src={user?.image} className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center 
                  text-white text-3xl font-bold border-2 border-white/30 shadow-md" />
                  
               
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{user?.name || 'User Name'}</h1>
                <p className="text-green-100 mt-1">{user?.email || 'user@example.com'}</p>
                <p className="text-green-200 text-sm mt-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Member since {new Date().toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                      <p className="text-gray-700 font-medium mt-1">{user?.name}</p>
                    </div>
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                      <p className="text-gray-700 font-medium mt-1">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Account Status</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                      <div className="flex items-center mt-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="text-gray-700 font-medium">Active</p>
                      </div>
                    </div>
                    {/* <div className="border-b border-gray-100 pb-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</p>
                      <p className="text-gray-700 font-medium mt-1">{new Date().toLocaleString()}</p>
                    </div> */}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    border border-green-600 text-green-600 hover:bg-green-600 hover:text-white
                    shadow-sm hover:shadow-md flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Please log in to see your details.</p>
            </div>
          )}

          <EditUserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={(name, password) => {
              // TODO: Dispatch an action or API call to update the user
              console.log("Updated name:", name);
              console.log("Updated password:", password);
              setIsModalOpen(false); // Close modal after save
            }}
            initialName={user?.name || ''}
          />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-6 mt-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} My Profile. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;