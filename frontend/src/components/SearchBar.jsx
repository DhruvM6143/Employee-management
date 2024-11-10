import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const SearchBar = ({ searchTerm, setSearchTerm, show, setShow }) => {

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }


    return (
        <div className='border-t border-b bg-gray-50 w-auto'>
            <div className='inline-flex items-center justify-between border border-gray-400 px-4 py-2 mx-3 rounded-full w-[50%] sm:w-3/4'>
                <input
                    onChange={handleSearch}
                    value={searchTerm}
                    className='flex-1 outline-none bg-transparent text-sm'
                    type="text"
                    placeholder='Search...'
                />
                <img
                    onClick={() => setShow(false)}
                    className='cursor-pointer w-4 ml-2'
                    src={assets.cross_icon}
                    alt="Close Icon"
                />
            </div>
        </div>
    );
};

export default SearchBar;
