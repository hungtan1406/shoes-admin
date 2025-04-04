import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-1/2 px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Shoes App</h2>
        {children}
      </div>
      <div className='w-1/2 hidden md:block h-screen bg-sky-50 bg-auth-bg-img bg-co bg-center bg-no-repeat overflow-hidden relative'></div>
    </div>
  );
};

export default AuthLayout;
