import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './SideMenu';
import logo_brand from '../../assets/logo_brand.png';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className='flex items-center gap-5 h-16 border-b border-white bg-slate-50/50 backdrop-blur-[2px] p-4 sticky top-0 z-30'>
      <button
        className='block lg:hidden text-black'
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className='text-2xl' />
        ) : (
          <HiOutlineMenu className='text-2xl' />
        )}
      </button>
      <img
        src={logo_brand}
        alt='Brand Logo'
        className='w-28 h-auto object-contain ml-3'
      />
      {openSideMenu && (
        <div
          className={`fixed top-[61px] left-0 w-full bg-white transform ${
            openSideMenu ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
        >
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
