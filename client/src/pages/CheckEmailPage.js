import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiOutlineUserGroup } from "react-icons/hi2";

const CheckEmailPage = () => {
  const [data,setData] = useState({
    email : "",
  })

  const navigate = useNavigate()

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
        const response = await axios.post(URL,data)

        toast.success(response.data.message)

        if(response.data.success){
          setData({
            email : "",
          })
          navigate('/password',{
            state : response?.data?.data
          })
        } else {
          throw new Error(response.data.message);
        }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Error: No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Error: ${error.message}`);
      }
    };
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='w-fit mx-auto mb-8'>
            <HiOutlineUserGroup size={100}/>
        </div>

        <form className='grid gap-1 mt-3' onSubmit={handleSubmit}>
          
          <div className='flex flex-col gap-1'>
            
            <input 
              type='email'
              id='email'
              name='email'
              placeholder='Email Address'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-3 font-bold text-white leading-relaxed tracking-wide'>
            LOGIN
          </button>
        </form>

        <div className="my-8 flex items-center justify-center">
          <div className="w-1/2 h-0.5 bg-slate-200"></div>
          <div className="mx-4 text-sm text-slate-500">or</div>
          <div className="w-1/2 h-0.5 bg-slate-200"></div>
        </div>

        <p className='my-3 text-center text-sm'>New User? <Link to={"/register"} className='hover:text-primary font-semibold'>Create new account</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage