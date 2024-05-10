import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data,setData] = useState({
    password : "",
    userId : ""
  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!location?.state?.name){
      navigate('/email')
    }
  },[location.state.name, navigate])

  const handleOnChange = (e)=>{
    const { name, value } = e.target

    setData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
        const response = await axios({
          method :'post',
          url : URL,
          data : {
            userId : location?.state?._id,
            password : data.password
          },
          withCredentials : true
        })

        toast.success(response.data.message)

        if(response.data.success){
          dispatch(setToken(response?.data?.token))
          localStorage.setItem('token',response?.data?.token)

          setData({
            password : "",
          })
          navigate('/')
        }
    } catch (error) {
        if (error.response) {
          toast.error(error?.response?.data?.message)
        } else {
          toast.error("An unexpected error occurred.");
        }
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='w-fit mx-auto mb-8 flex justify-center items-center flex-col'>
            {/* <PiUserCircle size={80}/> */}
            <Avatar 
              width={100}
              height={100}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
            <h2 className='font-semibold text-lg mt-3'>{location?.state?.name}</h2>            
        </div>

        <hr class="my-8 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />

        <form className='grid gap-1 mt-2' onSubmit={handleSubmit}>
          
          <div className='flex flex-col gap-1'>
            
            <input 
              type='password'
              id='password'
              name='password'
              placeholder='Password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
            LOGIN
          </button>
        </form>

        <p className='my-4 text-center text-sm'><Link to={"/forgot-password"} className='hover:text-primary font-semibold'>Forgot Password?</Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage

