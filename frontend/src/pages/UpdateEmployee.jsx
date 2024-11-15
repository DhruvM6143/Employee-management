import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Title from '../components/Title';
import { useParams } from 'react-router-dom';

const UpdateEmployee = ({ loading }) => {
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [designation, setDesignation] = useState('');
    const [validName, setValidName] = useState(true)
    const [validEmail, setValidEmail] = useState(true)
    const [validPhone, setValidPhone] = useState(true)
    const [course, setCourse] = useState([]);
    const [image, setImage] = useState(false);
    const { id } = useParams()
    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/login');
        }
    }, [navigate]);
    const namePattern = /^[A-Za-z\s]{2,}$/;
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setValidName(namePattern.test(value));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        setValidPhone(phonePattern.test(value));
    };
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setValidEmail(emailPattern.test(value));
    };
    useEffect(() => {
        const fetchEmployee = async () => {
            if (token) {
                try {
                    const response = await axios.get(backendUrl + `/api/employee/employee/${id}`, { headers: { token } });
                    if (response.data.success) {
                        const employee = response.data.employee;
                        setEmail(employee.f_Email);
                        setName(employee.f_Name);
                        setPhone(employee.f_Mobile);
                        setGender(employee.f_Gender);
                        setDesignation(employee.f_Designation);
                        setCourse(employee.f_Course);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error("Error fetching employee data");
                }
            }
        };

        fetchEmployee();
    }, [id, backendUrl, token]);


    const onSubmitHandler = async (e) => {

        e.preventDefault();
        if (validEmail && validName && validPhone) {
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('name', name);
                formData.append('gender', gender);
                formData.append('designation', designation);
                formData.append('course', course);
                formData.append('phone', phone);
                formData.append('image', image);


                const response = await axios.post(
                    backendUrl + `/api/employee/update-employee/${id}`,
                    formData, { headers: { token, 'Content-Type': 'multipart/form-data' } }



                );

                if (response.data.success) {
                    toast.success(response.data.message);
                    setEmail('')
                    setName('')
                    setGender('')
                    setDesignation('')
                    setCourse([])
                    setPhone('')
                    setImage(null)
                    navigate('/list-employee')

                } else {
                    toast.error(response.data.message);
                }

            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
        else {
            toast.error("Please fill all the required fields correctly")
        }
    };

    const handleCourseChange = (e) => {
        const value = e.target.value;
        setCourse((prevCourse) =>
            prevCourse.includes(value)
                ? prevCourse.filter((item) => item !== value)
                : [...prevCourse, value]
        );
    };



    return (
        <div>
            {loading ? (
                <Loading show={loading} />
            ) : (
                <div>
                    <div className='text-[50px] text-center'>
                        <Title text1={"Update"} text2={"Employee"} />
                    </div>

                    <form onSubmit={onSubmitHandler} className='flex flex-col w-[90%] sm:max-w-2xl m-auto mt-14 gap-6 text-gray-800'>
                        <div className='flex gap-4 items-center'>
                            <label htmlFor="Name" className='w-24 text-[20px]'>Name</label>
                            <input
                                onChange={handleNameChange}
                                value={name}
                                type="text"
                                placeholder='Enter Name...'
                                className='flex-1 px-3 py-2 border border-gray-800 rounded-md'

                            />
                            {!validName && <p className="text-red-500 text-sm">Invalid name (only letters and spaces, min. 2 characters)</p>}
                        </div>

                        <div className='flex gap-4 items-center'>
                            <label htmlFor="Email" className='w-24 text-[20px]'>Email</label>
                            <input
                                onChange={handleEmailChange}
                                value={email}
                                type="email"
                                placeholder='Enter Email...'
                                className='flex-1 px-3 py-2 border border-gray-800 rounded-md'

                            />
                            {!validEmail && <p className="text-red-500 text-sm">Invalid email format</p>}
                        </div>

                        <div className='flex gap-4 items-center'>
                            <label htmlFor="Phone" className='w-24 text-[20px]'>Phone No.</label>
                            <input
                                onChange={handlePhoneChange}
                                value={phone}
                                type="tel"
                                placeholder='Enter Phone no...'
                                className='flex-1 px-3 py-2 border border-gray-800 rounded-md'

                            />
                            {!validPhone && <p className="text-red-500 text-sm">Phone must be 10 digits</p>}
                        </div>

                        <div className='flex gap-4 items-center'>
                            <label htmlFor="Designation" className='w-24 text-[20px]'>Designation</label>
                            <select
                                onChange={(e) => setDesignation(e.target.value)}
                                className='flex-1 px-3 py-2 border border-gray-800 rounded-md'

                            >
                                <option value="HR">HR</option>
                                <option value="Manager">Manager</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>

                        <div className='flex gap-4 items-center'>
                            <label className='w-24 text-[20px]'>Gender</label>
                            <div className='flex gap-4'>
                                <label className='flex items-center gap-2'>
                                    <input
                                        onClick={() => setGender("male")}
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        className='border-gray-800'
                                    />
                                    Male
                                </label>
                                <label className='flex items-center gap-2'>
                                    <input
                                        onClick={() => setGender("female")}
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        className='border-gray-800'
                                    />
                                    Female
                                </label>
                            </div>
                        </div>

                        <div className='flex gap-4 items-center'>
                            <label className='w-24 text-[20px]'>Course</label>
                            <div className='flex gap-4'>
                                <label className='flex items-center gap-2'>
                                    <input
                                        onChange={handleCourseChange}
                                        type="checkbox"
                                        value="MCA"
                                        checked={course.includes("MCA")}
                                        className='border-gray-800'
                                    />
                                    MCA
                                </label>
                                <label className='flex items-center gap-2'>
                                    <input
                                        onChange={handleCourseChange}
                                        type="checkbox"
                                        value="BCA"
                                        checked={course.includes("BCA")}
                                        className='border-gray-800'
                                    />
                                    BCA
                                </label>
                                <label className='flex items-center gap-2'>
                                    <input
                                        onChange={handleCourseChange}
                                        type="checkbox"
                                        value="BSC"
                                        checked={course.includes("BSC")}
                                        className='border-gray-800'
                                    />
                                    BSC
                                </label>
                            </div>
                        </div>

                        <div className='flex gap-4 items-center'>
                            <label htmlFor="Upload Image" className='w-24 text-[20px]'>Upload Image</label>
                            <input
                                onChange={(e) => setImage(e.target.files[0])}
                                type="file"
                                className='flex-1 px-3 py-2 border border-gray-800 rounded-md'
                            />
                        </div>
                        <button type='submit' className='w-28 py-3 mt-4 bg-black text-white mx-auto'>Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UpdateEmployee;
