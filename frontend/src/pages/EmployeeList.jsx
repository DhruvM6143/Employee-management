import React, { useContext, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import { assets } from '../assets/frontend_assets/assets';
import ReactPaginate from 'react-paginate';

const EmployeeList = ({ loading }) => {
    const { token, navigate, backendUrl, setToken } = useContext(ShopContext);
    const [employees, setEmployees] = useState([]);
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [limit, setLimit] = useState(4);
    const [searchTerm, setSearchTerm] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            navigate('/login');
        } else {
            setToken(storedToken);
        }
    }, [token, setToken]);

    const fetchEmployees = async (page = 1) => {
        try {
            const response = await axios.get(`${backendUrl}/api/employee/paginatedusers?page=${page}&limit=${limit}`, {
                headers: { token }
            });
            if (response.data.success) {
                const { results } = response.data;
                setEmployees(results.result);
                setCount(results.totalEmployee);
                setPageCount(results.pageCount);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching employees");
        }
    };
    const filteredEmployee = searchTerm
        ? employees.filter((employee) =>
            employee.f_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.f_Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(employee.f_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.f_Designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.f_Gender.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : employees;

    useEffect(() => {
        if (token) {
            fetchEmployees(currentPage);
        }
    }, [token, currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    const handleEdit = (id) => {
        navigate(`/update-employee/${id}`);
    };

    const handleRemove = async (id) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/employee/delete-employee/${id}`, { headers: { token } });
            if (response.data.success) {
                toast.success("Employee deleted successfully");
                fetchEmployees(currentPage);
            } else {
                toast.error("Error deleting employee");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting employee");
        }
    };

    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <Loading show={loading} />
            ) : (
                <div>
                    <div className='flex flex-col sm:flex-row justify-between items-center'>
                        <div className="mb-4">
                            <Title text1={"Employees"} text2={"List"} />
                        </div>
                        <div className={`flex ${show ? 'gap-0 sm:w-[55%]' : 'gap-10'} mb-5 items-center w-full sm:w-[40%]`}>
                            {show ? (
                                <SearchBar employees={employees} searchTerm={searchTerm} setSearchTerm={setSearchTerm} show={show} setShow={setShow} />
                            ) : (
                                <img src={assets.search_icon} onClick={() => setShow(true)} className='w-5 cursor-pointer' alt="Search Icon" />
                            )}
                            <p>Total Count: {count}</p>
                            <button onClick={() => navigate('/create-employee')} className='w-[130px] py-3 bg-black text-white mx-auto rounded-md'>Create Employee</button>
                        </div>
                    </div>

                    {/* Employee List Table for Desktop, Cards for Mobile */}
                    <div className="bg-white shadow-lg rounded-lg">
                        <div className="hidden sm:grid grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 border-b bg-gray-100 text-sm font-medium">
                            <b>Unique Id</b>
                            <b>Image</b>
                            <b>Name</b>
                            <b>Email</b>
                            <b>Mobile No</b>
                            <b>Designation</b>
                            <b>Gender</b>
                            <b>Course</b>
                            <b>Create Date</b>
                            <b className="text-right">Action</b>
                        </div>

                        {filteredEmployee.map((item, index) => (
                            <div key={index} className="border-b sm:border-0 sm:grid sm:grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 hover:bg-gray-50 text-sm flex flex-col sm:flex-row">
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_id}</p>
                                </div>
                                <div className="flex sm:block items-center">
                                    <img className="w-12 h-12 object-cover rounded-full" src={item.f_Image} alt={`${item.f_UserName} Image`} />
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_Name}</p>
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_Email}</p>
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_Mobile}</p>
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_Designation}</p>
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_Gender}</p>
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{item.f_Course}</p>
                                </div>
                                <div className="flex sm:block">
                                    <p className="ml-2 sm:ml-0">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="flex sm:justify-end space-x-2 mt-2 sm:mt-0">
                                    <button onClick={() => handleEdit(item._id)} className="text-blue-500 hover:text-blue-700 text-sm">Edit</button>
                                    <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                marginPagesDisplayed={2}
                containerClassName="flex justify-center space-x-2 mt-4"
                pageClassName="page-item"
                pageLinkClassName="inline-block px-4 py-2 text-sm font-semibold text-black-500 border border-gray-300 rounded hover:bg-blue-100 hover:text-black-700 transition-colors"
                previousClassName="page-item"
                previousLinkClassName="inline-block px-4 py-2 text-sm font-semibold text-black-500 border border-gray-300 rounded hover:bg-blue-100 hover:text-black-700 transition-colors"
                nextClassName="page-item"
                nextLinkClassName="inline-block px-4 py-2 text-sm font-semibold text-black-500 border border-gray-300 rounded hover:bg-blue-100 hover:text-black-700 transition-colors"
                activeClassName="bg-blue-500 text-white"
                disabledClassName="text-gray-400 cursor-not-allowed"
            />
        </div>
    );
};

export default EmployeeList;
