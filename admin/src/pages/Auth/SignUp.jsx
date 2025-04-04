import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/input/ProfilePhotoSelector';
import AuthInput from '../../components/input/AuthInput';
import { validateEmail } from '../../utils/helper';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';
    if (!fullName) {
      setError('Please enter full name');
      toast.error(error);
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter valid email address');
      toast.error(error);
      return;
    }
    if (!username) {
      setError('Please enter username');
      toast.error(error);
      return;
    }
    if (!password) {
      setError('Please enter password');
      toast.error(error);
      return;
    }

    setError('');

    try {
      //Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        username,
        email,
        password,
        profileImageUrl,
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
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <AuthInput
              type='text'
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label='FullName'
              placeholder='Hung Tan'
            />
            <AuthInput
              type='text'
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Address'
              placeholder='hungtanth1406@gmail.com'
            />
            <AuthInput
              type='text'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              label='username'
              placeholder='username'
            />
            <AuthInput
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password'
              placeholder='Min 8 Character'
            />
          </div>
          <button type='submit' className='btn-primary'>
            SIGN UP
          </button>
          <p className='text-[13px] text-slate-700 mt-3'>
            Already have an account?{' '}
            <Link className='font-medium text-primary underline' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
