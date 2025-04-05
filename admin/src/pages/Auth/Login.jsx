import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import { Link, useNavigate } from 'react-router-dom';
import AuthInput from '../../components/input/AuthInput.jsx';
import { toast } from 'react-toastify';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/UserContext.jsx';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter valid email address');
      toast.error(error);
      return;
    }
    if (!password) {
      setError('Please enter password');
      toast.error(error);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log(response);

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong! Please try again');
      }
    }
  };
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-medium text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>
        <form onSubmit={handleLogin}>
          <AuthInput
            type='text'
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label='Email Address'
            placeholder='hungtanth1406@gmail.com'
          />
          <AuthInput
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label='Password'
            placeholder='Min 8 Character'
          />
          <button type='submit' className='btn-primary'>
            LOGIN
          </button>
          {/* <p className='text-[13px] text-slate-700 mt-3'>
            Don't have an account?{' '}
            <Link className='font-medium text-primary underline' to='/signup'>
              Sign Up
            </Link>
          </p> */}
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
