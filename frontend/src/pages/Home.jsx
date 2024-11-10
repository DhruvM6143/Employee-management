import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import Loading from '../components/Loading'

const Home = ({ loading }) => {
    const { token, navigate } = useContext(ShopContext)
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [])
    return (
        <div>
            {loading ? (<Loading show={loading} />)
                :
                (<div className='text-[50px] flex justify-center'>
                    <Title text1={"Welcome to "} text2={"Admin's Panel"} />

                </div>)
            }
        </div>
    )
}

export default Home