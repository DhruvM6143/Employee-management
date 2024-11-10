import React, { useContext, useEffect } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'

const Profile = () => {
    const { token, navigate, setToken } = useContext(ShopContext)
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (!storedToken) {

            navigate('/login')
        }
        else {
            setToken(storedToken)
        }
    }, [token, navigate, setToken])
    return (
        <div>
            <Title text1={"Your"} text2={"Profile"} />
        </div>
    )
}

export default Profile