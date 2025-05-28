import { useEffect, useState } from 'react';
import axios from 'axios';
import EditModal from '../Modal/AdminEditModal';
import UserModal from '../Modal/AddModal';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../Redux/redux-store.';
import { useSelector } from 'react-redux';


export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string; 
}

const AdminHomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[] | []>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
   const dispatch = useDispatch()
   const navigate = useNavigate()
  const usersPerPage = 5;
  const admin = useSelector((state: RootState) => state.adminLogin.accessToken);
  const isLoggedIn = useSelector((state: RootState) => state.adminLogin);

 
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4200/admin/get-users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchUsers();
  }, []);


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

 
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId: string) => {
  
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:4200/admin/delete-user/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User Deleted Sucessfully')
      setError(''); 
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleSaveEdit = async (name: string, image: string | null) => {
    if (!selectedUser) return;
    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }

    // Use previous image if image is empty
    const imageToSend = image || selectedUser.image || '';

    try {
      const updateData: any = {
        name: name.trim(),
        image: imageToSend
      };

      const response = await axios.put(
        `http://localhost:4200/admin/edit-user/${selectedUser._id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.message || 'User updated successfully');

      setUsers(users.map(user =>
        user._id === selectedUser._id
          ? { ...user, name: name.trim(), image: imageToSend }
          : user
      ));

      setIsOpenModal(false);
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };
  const hanleLogout = async() =>{
    dispatch(logout())
    navigate('/ad-login')
  }
  
  const handleAddUser = async (name: string, email: string, image: string) => {
    try {
      const newUser = { name, email, image };
      const response = await axios.post('http://localhost:4200/admin/add-user', newUser, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Add the new user to the users state
      setUsers(prev => [...prev, response.data]);
      setIsAddModal(false);
      toast.success('User added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    }
  };
  

  if (loading) return <div className="text-center py-8 text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
 
      <nav className="bg-black px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-400">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsAddModal(true)} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
              >
              Add User
            </button>
            <button 
              onClick={() => hanleLogout()} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
              >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        />
      
      {isAddModal && (
        <UserModal
        isOpen={isAddModal}
        onClose={() => setIsAddModal(false)}
        onSave={handleAddUser}
        setUsers={setUsers}
        />
      )}


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4 md:mb-0">User Management</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
          </div>
        </div>

    
     {selectedUser && (
  <EditModal
    isOpen={isOpenModal}
    onClose={() => setIsOpenModal(false)}
    onSave={(name, _, image) => handleSaveEdit(name, image)} 
    initialName={selectedUser?.name || ''}
    initialImage={selectedUser?.image || ''}
  />
)}

{isLoggedIn ? (
  // Users Table
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-green-400 uppercase tracking-wider">
              Actions
            </th>
           
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.image && (
                    <img
                      src={user.image}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsOpenModal(true);
                    }}
                    className="mr-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-400">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
) : (
  // If not logged in
  <div className="px-6 py-12 text-center">
    <p className="text-gray-500">Please log in to see your details.</p>
  </div>
)}

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="bg-gray-750 px-4 py-3 flex items-center justify-between border-t border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastUser, filteredUsers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
                    >
                      <span className="sr-only">First</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M8.707 5.293a1 1 0 010 1.414L5.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
                    >
                      <span className="sr-only">Last</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M11.293 14.707a1 1 0 010-1.414L14.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default AdminHomePage;