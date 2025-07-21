import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError('Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.log("SignUp Error", error);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something Went Wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-md">

        <div className="flex flex-col justify-center">
          <h3 className="text-lg sm:text-xl font-semibold text-black text-center">Create an Account</h3>
          <p className="text-xs sm:text-sm text-slate-700 text-center mt-1.5 mb-6">
            Join us today by entering your details below.
          </p>

          <form onSubmit={handleSignup}>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Ryan"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
              />

              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="ryan@gmail.com"
                type="text"
              />

              <div className="col-span-1 sm:col-span-2">
                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Min 8 Characters"
                  type="password"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}

            <button
              className="btn-primary mt-4 w-full py-2 text-sm sm:text-base"
              type="submit"
            >
              Sign Up
            </button>

            <p className="text-[13px] sm:text-sm text-slate-800 mt-4 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 font-medium underline"
              >
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
