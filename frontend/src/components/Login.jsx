import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const navigate = useNavigate()
    return (
        <>{localStorage.getItem('token') ? navigate('/resume_analysis') : <div className='flex flex-col p-5 mx-auto text-center border-4 border-dotted w-fit'>
            <div className='text-2xl font-extrabold'>LogIn</div>
            <div className='flex flex-col items-center gap-5 mt-5 '>
                <input
                    onChange={handleEmail}
                    type="text"
                    placeholder="Enter email"
                    className="w-full p-3 border-b-2 outline-none focus:border-yellow-500"
                />

                <input
                    onChange={handlePassword}
                    className="w-full p-3 border-b-2 outline-none focus:border-yellow-500"
                    type="password"
                    placeholder='Enter your password' />

                <button className='px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700'>Login</button>
            </div>
            <p className='mt-4 text-s font-extralight'>Don't have an account? <Link className='text-yellow-800' to="/signup">Signup</Link></p>
        </div>}

        </>
    )
}

export default Login
