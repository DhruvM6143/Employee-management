import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const ShopContext = createContext()

export const ShopContextProvider = (props) => {
    const [userData, setUserData] = useState({})
    const navigate = useNavigate()
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token, setToken] = useState('')


    const value = {
        backendUrl,
        setToken, token, navigate, userData, setUserData

    }
    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
        }
        else {
            navigate('/login')
        }
    }, [])
    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {

            setUserData(JSON.parse(storedUserData)); // Parse the stored JSON string to an object
        }
    }, []);


    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}