import axios from 'axios'
import React, { useState } from 'react'
import { Link, redirect, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import z from 'zod'

const SignUp = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [apiData, setApiData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const handleName = (e) => {
        setName(e.target.name)
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSignUp = async () => {
        if (!name || !password || !email) {
            toast.error('Please fill all the details')
            console.log(name, email, password);
            return -1
        }
        else {
            setApiData({
                name: name,
                email: email,
                password: password
            })
            const response = await axios.post("http://localhost:3000/api/users/signup", { name, email, password })
            if (!response.data.success)
                toast.error(response.data.message)
            else {
                toast.success(response.data.message)
                navigate('/resume_analysis')
                if (!localStorage.getItem('token')){
                    localStorage.setItem('token', response.data.user.token)
                    localStorage.setItem('email', response.data.user.email)
                }
            }
            console.log(response);

        }
    }

    return (
        <>
            <div className='flex flex-col p-5 mx-auto text-center border-4 border-dotted w-fit'>
                <div className='text-2xl font-extrabold'>SignUp</div>
                <div className='flex flex-col items-center gap-5 mt-5 '>
                    <input onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border-b-2 outline-none focus:border-yellow-500" type="text" placeholder='Enter email' />
                    <input onChange={(e) => setName(e.target.value)} className="w-full p-3 border-b-2 outline-none focus:border-yellow-500" type="text" placeholder='Enter your name' />
                    <input onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border-b-2 outline-none focus:border-yellow-500" type="password" placeholder='Enter your password' />
                    <button onClick={handleSignUp} className='px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-700'>SignUp</button>
                </div>
                <p className='mt-4 text-s font-extralight'>Already have an account? <Link className='text-yellow-800' to="/login">Login</Link></p>
            </div>
        </>
    )
}

export default SignUp
