import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
const Login = ({ loading }) => {
    const { backendUrl, token, navigate, setToken, userData, setUserData } = useContext(ShopContext)
    const [curr, setCurr] = useState('Login');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isValid, setIsValid] = useState(true)
    const [isNameValid, setIsNameValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const handleEmailChange = (e) => {

        const emailvalue = e.target.value;
        setEmail(emailvalue)

        const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/
        setIsValid(emailPattern.test(emailvalue))
    }
    const usernameChange = (e) => {
        const usernamevalue = e.target.value;
        setUsername(usernamevalue)

        const usernamePattern = /^[a-zA-Z0-9 .'-]+$/
        setIsNameValid(usernamePattern.test(usernamevalue))
    }
    const passwordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue)

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        setIsPasswordValid(passwordPattern.test(passwordValue))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (isValid && isNameValid && isPasswordValid) {
                if (curr === 'Sign up') {
                    const response = await axios.post(backendUrl + '/api/admin/signup', { email, password, username })
                    if (response.data.success) {
                        setToken(response.data.token)
                        setUserData(response.data.newUser); // Store user data with username
                        localStorage.setItem('userData', JSON.stringify(response.data.newUser));
                        localStorage.setItem('token', response.data.token);
                        toast.success("Sign up successful");
                    }
                    else {
                        toast.error("Email already exists")
                    }


                }
                else {
                    const response = await axios.post(backendUrl + '/api/admin/login', { email, password })
                    if (response.data.success) {
                        setToken(response.data.token)
                        setUserData(response.data.existingUser)
                        localStorage.setItem('userData', JSON.stringify(response.data.existingUser));
                        localStorage.setItem('token', response.data.token)
                        toast.success("Login successful")
                    }
                    else {
                        toast.error("Invalid email or password")
                    }
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }

    }, [token])




    return (
        <div>
            {loading ? (<Loading show={loading} />)
                : (
                    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
                        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                            <p className='prata-regular text-3xl'>{curr}</p>
                            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
                        </div>
                        {curr === 'Login' ? null : <input
                            type="text"
                            onChange={usernameChange}
                            value={username}
                            placeholder='Name'
                            className='w-full px-3 py-2 border border-gray-800'
                            required
                        />}
                        {!isNameValid && <p style={{ color: 'red' }}>Name can only contain letters, spaces, ., ', and -</p>}

                        <input
                            type="email"
                            onChange={handleEmailChange}
                            value={email}
                            placeholder='Email'
                            className='w-full px-3 py-2 border border-gray-800'
                            required
                        />
                        {!isValid && <p style={{ color: 'red' }}>Email must end with @gmail.com and can only contain letters, numbers, ., _, and -</p>}

                        <div className='relative w-full'>
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                                onChange={passwordChange}
                                value={password}
                                placeholder='Password'
                                className='w-full px-3 py-2 border border-gray-800'
                                required
                            />
                            {!isPasswordValid && (
                                <p style={{ color: 'red' }}>
                                    Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character.
                                </p>
                            )}
                            <button
                                type="button"
                                className='absolute right-3 top-1/2 transform -translate-y-1/2' // Positioning the eye icon
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <img className='w-[23px]' src={showPassword ? assets.eye : assets.hidden} alt="Toggle password visibility" />
                            </button>
                        </div>
                        <div className='w-full flex justify-between text-sm mt-[-9px]'>
                            <p className='cursor-pointer'>Forgot your password?</p>
                            {curr === 'Login' ? (
                                <p className='cursor-pointer' onClick={() => setCurr('Sign up')}>Create Account</p>
                            ) : (
                                <p className='cursor-pointer' onClick={() => setCurr('Login')}>Login Here</p>
                            )}
                        </div>
                        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{curr === 'Login' ? 'Sign In' : 'Sign Up'}</button>
                    </form>
                )}
        </div>
    )
}

export default Login