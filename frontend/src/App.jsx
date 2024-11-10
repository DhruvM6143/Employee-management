import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CreateEmployee from './pages/CreateEmployee';
import UpdateEmployee from './pages/UpdateEmployee';

import Login from './pages/Login';
import Home from './pages/Home';
import EmployeeList from './pages/EmployeeList';
import Profile from './pages/Profile';
const App = () => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false); // stop loading even if there's an error
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer autoClose={2000} />
      <NavBar />
      {/* <SearchBar /> */}
      <Routes>
        <Route path='/' element={<Home loading={loading} />} />
        <Route path='/login' element={<Login loading={loading} />} />
        <Route path='/create-employee' element={<CreateEmployee loading={loading} />} />
        <Route path='/update-employee/:id' element={<UpdateEmployee loading={loading} />} />
        <Route path='/list-employee' element={<EmployeeList loading={loading} />} />
        <Route path='/myprofile' element={<Profile loading={loading} />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App