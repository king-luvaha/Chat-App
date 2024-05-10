import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import logo from '../assets/Gumzo-logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('user',user)

  const fetchUserDetails = async()=>{
    try {
      const URL = `${"http://localhost:8080"}/api/user-details`;
        const response = await axios({
          url : URL,
          withCredentials : true
        })

        console.log("Dispatching setUser with payload:", response.data.data);
        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
          dispatch(logout())
          navigate("/email")
        }

        console.log("Current User Details",response)
    } catch (error) {
      console.log("error",error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  // socket connection
  useEffect(()=>{
    const socketConnection = io("https://chatapp-api.onrender.com",{
      auth : {
        token : localStorage.getItem('token')
      },
    })

    socketConnection.on('onlineUser',(data)=>{
      console.log(data)
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])

  const basePath = location.pathname === '/'

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
          <SideBar />
        </section>

        {/* Message Component */}
        <section className={`${basePath && "hidden"}`}>
            <Outlet />
        </section>

        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
          <div>
            <img 
              src={logo}
              width={250}
              alt='logo'
            />
          </div>
          <p className='text-lg mt-2 text-slate-500'>Select a chat to start messaging</p>
        </div>
    </div>
  )
}

export default Home