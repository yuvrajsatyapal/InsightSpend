import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance  from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // handle Login Form Submit

  const handleLogin = async (e) => {
    e.preventDefault();


    if(!validateEmail(email)) {
      setError('Please enter a valid email address'); 
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setError("");

    // Login API Call

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token , user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }

    } catch (error) {

      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again later.")
      }
    }
  }

  return (
    
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">

        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
          <p className="text-xs text-slate-700 mt-1.5 mb-6">
            Please enter your details to login in
          </p>

          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="ryan@gmail.com"
              type="text"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
              type="password"
            />

            {error && (
              <p className="text-xs text-red-500 pb-2.5 mt-2">{error}</p>
            )}

            <button className="btn-primary mt-2 w-full" type="submit">
              Login
            </button>

            <p className="text-[13px] text-slate-800 mt-3 text-center">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 font-medium underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login