import React, { useEffect, useRef, useState } from 'react';
import Avatar from "./Avatar";
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({onClose,user}) => {
    const [data,setData] = useState({
        name : user?.user,
        profile_pic : user?.profile_pic
    })

    const dataToSend = {
      name: data.name,
      profile_pic: data.profile_pic,
    };

    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()

    useEffect(()=>{
        setData((preve)=>{
            return{
                ...preve,
                ...user
            }
        })
    },[user])

    const handleOnChange = (e)=>{
        const { name, value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleOpenUploadPhoto = (e)=>{
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }

    const handleUploadPhoto = async(e)=> {
        const file = e.target.files[0]

        const uploadPhoto = await uploadFile(file)

        setData((preve)=>{
            return{
                ...preve,
                profile_pic : uploadPhoto?.url
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        e.stopPropagation();

        console.log("Data to be sent:", data); // Add this line to log the data

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`

        try {
            const response = await axios({
                method : 'post',
                url : URL,
                data : dataToSend,
                withCredentials : true
            })

            console.log('Response',response)
            toast.success(response?.data?.message)

            if(response.data.success){
                dispatch(setUser(response.data.data))
                onClose()
            } else {
                // Handle the case where the server responds but not with success
                toast.error(response.data.message || 'Update failed without a specific error.');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            // Display a more informative error message if possible
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
            <h2 className='font-semibold flex justify-center items-center'>Edit Profile</h2>

            <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>

                <div>
                    
                    <div className='my-1 flex justify-center items-center gap-4'>
                        <Avatar
                            width={150}
                            height={150}
                            imageUrl={data?.profile_pic}
                            name={data?.name}
                        />
                        <label htmlFor='profile_pic'>
                            <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                            <input 
                                type='file'
                                id='profile_pic'
                                className='hidden'
                                onChange={handleUploadPhoto}
                                ref={uploadPhotoRef}
                            />
                        </label>
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor='name' className='text-slate-500 text-xs'>Name</label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='w-full py-1 px-2 focus:outline-primary border-0.5 bg-gray-100'
                    />
                </div>
                <Divider />
                <div className='flex gap-2 w-fit ml-auto'>
                    <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                    <button onClick={handleSubmit} className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary' >Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default React.memo(EditUserDetails);