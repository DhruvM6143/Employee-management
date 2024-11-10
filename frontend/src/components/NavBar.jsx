import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
    const { setToken, navigate, token, userData } = useContext(ShopContext)


    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        localStorage.removeItem('userData')
        navigate('/login')
    }
    return (
        <div className='flex items-center py-3 font-medium w-full'>
            {/* Logo */}
            <Link to='/' className='flex-shrink-0'>
                <img src={logo} alt="Logo" className='w-20' />
            </Link>

            {/* Navigation links */}
            <ul className='flex justify-evenly w-full gap-5 text-sm text-gray-700'>
                <NavLink to='/' className="flex flex-col items-center gap-1">
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' />
                </NavLink>
                <NavLink to='/list-employee' className="flex flex-col items-center gap-1">
                    <p>Employee List</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' />
                </NavLink>
                <NavLink to='/myprofile' className="flex flex-col items-center gap-1">
                    <p>{token ? userData?.f_UserName : "Profile"}</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' />
                </NavLink>
                <NavLink to='/login' className="flex flex-col items-center gap-1">
                    <p onClick={logout}>Logout</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' />
                </NavLink>
            </ul>
        </div>
    );
};

export default NavBar;
