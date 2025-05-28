import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../Redux/redux-store."; 
import { userLogin } from "../../Redux/slices/loginSlice"; 
import { toast, ToastContainer } from "react-toastify";
import { PayloadAction } from "@reduxjs/toolkit";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const resultAction :PayloadAction<any > = await dispatch(userLogin({ email, password }));

      if (userLogin.fulfilled.match(resultAction)) {
        toast.success("Login successfully");
        setTimeout(()=>{
          navigate("/"); 
        },1000)
      } else {
        toast.error("Invalid Email or Password:", resultAction.payload);
      }
    } catch (err:any) {
      toast.error("Unexpected error:", err);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-green-50">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-white items-center justify-center">
        <img
          src="/img/login.jpg"
          alt="Sign-up illustration"
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
      {/* Right side - Login form */}
      <div className="bg-white p-10 w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-8">
        <div className="my-auto flex flex-col w-full max-w-[450px] mx-auto mt-8 mb-10">
          <p className="text-[32px] font-bold mb-6 text-green-600">Login</p>
         
          {/* <div className="">
            <form className="pb-2" onSubmit={handleSubmit}>
              <input type="hidden" name="provider" value="google" />
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-800 hover:bg-green-50 h-10 px-4 w-full py-6"
                type="submit"
              >
                <span className="mr-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 48 48"
                    enableBackground="new 0 0 48 48"
                    className="h-5 w-5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                </span>
                <span>Google</span>
              </button>
            </form>
            <form className="pb-2" onSubmit={handleSubmit}>
              <input type="hidden" name="provider" value="google" />
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-800 hover:bg-green-50 h-10 px-4 w-full py-6"
                type="submit"
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-green-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>Phone</span>
              </button>
            </form> */}
          {/* </div> */}
          <p className="flex justify-between text-sm mt-2">
            <a href="/signup" className="font-medium text-gray-600 text-sm">
              Don't have an account? Sign up
            </a>
            {/* <a href="" className="text-green-600 hover:text-green-700">
              Forget Password?
            </a> */}
          </p>
          {/* <div className="relative my-4">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-gray-300"></div>
              <div className="mx-2 text-gray-500">or</div>
              <div className="grow border-t border-gray-300"></div>
            </div>
          </div> */}
          <div>
            <form noValidate className="mb-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label className="text-gray-700" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label className="text-gray-700 mt-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border bg-white text-gray-800 border-gray-300 px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* <div className="flex items-center space-x-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-200 accent-green-600"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a href="/terms" className="underline text-green-600 hover:text-green-700">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="underline text-green-600 hover:text-green-700">
                        Privacy Policy
                      </a>
                    </label>
                  </div> */}
                </div>
                <button
                  className="whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 flex w-full max-w-full mt-6 items-center justify-center rounded-lg px-4 py-4 text-base font-medium"
                  type="submit"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;