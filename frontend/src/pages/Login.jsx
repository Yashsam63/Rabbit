import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from "../assets/login.webp"
import { loginUser } from '../redux/Slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { mergeCarts } from '../redux/Slices/cartSlice';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId ,loading } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    //get redirect parammeter and check if it's checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() =>{
        if(user){
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCarts({guestId , user})).then(()=>{
                    navigate(isCheckoutRedirect ? "/checkout" : "/")
                })
            }else{
                navigate(isCheckoutRedirect ? "/checkout" : "/")
            }
        }
    },[user , guestId , cart , navigate , isCheckoutRedirect, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here

        dispatch(loginUser({ email, password }));
    }

    return (
        <div className='flex'>
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form onSubmit={handleSubmit} action="" className='w-full max-w-md bg-white p-8 rounded-lg border sahdow-sm'>
                    <div className="flex justify-center mb-6">
                        <h2 className='text-xl font-medium'>Rabbit</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Hey there!👋</h2>
                    <p className="text-center mb-6">
                        Enter your email and password to Login.
                    </p>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full border  p-2 rounded"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full border  p-2 rounded"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition duration-200">
                        {loading ? "Loading..." : "Sign In"}
                    </button>
                    <p className="mt-6 text-center text-sm">
                        Don't have an account? {""}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className=" text-blue-500 ">Register</Link>
                    </p>
                </form>
            </div>
            <div className="hidden w-1/2 bg-gray-800 md:block">
                <div className="h-full flex flex-col justify-center items-center">
                    <img src={login} alt="login to account" className='h-[750px] w-full object-cover' />
                </div>
            </div>
        </div>
    )
}

export default Login 
