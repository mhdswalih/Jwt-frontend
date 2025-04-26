import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image:''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { name, email, password ,image} = formData;
  
  
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }
  
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }
  
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4200/add-user', formData);
      
      toast.success(response.data.message || 'User created successfully');
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', err);
    }
  };
  

  return (
    <div className="bg-green-50 min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center p-6">
        <img
          src="/img/login.jpg"
          alt="Sign-in illustration"
          className="max-w-full h-screen object-cover"
        />
      </div>
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
      {/* Right side - Sign-in form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-8">
        <div className="my-auto flex flex-col w-full max-w-[450px] mx-auto mt-8 md:mt-0">
          <p className="text-[32px] mt-6 font-bold text-green-600">Sign Up</p>
          <p className="mb-2.5 mt-2.5 font-normal text-gray-600">
            Create your account to get started!
          </p>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <p className="flex justify-between text-sm mt-2">
            <a
              href="/Login"
              className="font-medium text-gray-600 hover:text-green-700"
            >
              Already have an account? Login
            </a>
          </p>

          <div className="relative my-4">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-gray-300"></div>
              <div className="mx-2 text-gray-500">or</div>
              <div className="grow border-t border-gray-300"></div>
            </div>
          </div>

          <div>
            <form noValidate className="mb-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label className="text-gray-700" htmlFor="name">Name</label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    id="name"
                    placeholder="Enter Your Name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <label className="text-gray-700" htmlFor="email">Email</label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                 <label className="text-gray-700" htmlFor="image">Upload Image</label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    id="image"
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange} 
                    required
                  />

                  <label className="text-gray-700 mt-2" htmlFor="password">Password</label>
                  <input
                    id="password"
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 flex w-full max-w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
                  type="submit"
                >
                  Register 
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;