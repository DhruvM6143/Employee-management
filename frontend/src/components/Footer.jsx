import React from 'react'
import { assets } from '../assets/frontend_assets/assets'
import logo from '../assets/logo.jpg';
const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={logo} className='mb-3 w-[80px]' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        A comprehensive employee management system enabling admin to create, update, and manage employee records. Features validation, image upload, Cloudinary integration, and secure database storage.
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='cursor-pointer flex flex-col gap-1 text-gray-600'>
                        <li >HOME</li>
                        <li >ABOUT US</li>
                        <li >DELIVERY</li>
                        <li >PRIVACY POLICY</li>
                    </ul>
                </div>
                <div>
                    <p className='text-cl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+1-212-456-7890</li>
                        <li>contact@admin.com</li>
                    </ul>
                </div>
            </div>
            <div className=''>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ (Dhruv Madaan) admin.com - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer