import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/custom/Navbar'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import LoadingSpinner from './components/custom/LoadingSpinner'
import VideoMeta from './components/custom/Video/VideoMeta'
import Video from './pages/Video'

function App() {

  const [loading,setLoading]=useState(false)
  const [isAuthenticated,setIsAuthenticated]=useState(false)
  const [userData,setUserData]=useState(null)
  const dispatch=useDispatch()


  useEffect(()=>
{
      if(userData)
        {
          console.log("app.jsx userdata is :::",userData)
            dispatch(login(userData));
        } 

},[userData])

  useEffect(()=>
    {

    const checkAuth=async()=>
    {
        setLoading(true)
        try {
            const currentUser=await axios.get("http://localhost:8000/api/v1/users/current-user",{
                withCredentials:true,
            })

            console.log("current user data=",currentUser )
            setIsAuthenticated(true)
            setUserData(currentUser.data?.data)
            // setLoading(false)
            // console.log("userdata is:",userData)


        } catch (error) {
            
            if(error.response?.status)
            {
                try {

                    const generateTokens=await axios.post("http://localhost:8000/api/v1/users/refreshtoken",{},{withCredentials:true})
                    console.log("tokens generated=>",generateTokens)
                    setIsAuthenticated(true)
                    // setLoading(false)


                } catch (error) {
                    
                    if(error.response?.status)
                    {
                        console.log(error.response,"no tokens were sent")
                        setIsAuthenticated(false)
                        // setLoading(false)
                    }

                }


            }
        }finally
        {
          setLoading(false);
        }
    };

    checkAuth();

  },[])

    if(loading)
    {
      return(
        <LoadingSpinner/>
      )
    }
  return (
  <div className='bg-[#0f0f0f]'>
    <Navbar/>
    <Outlet/>
    {/* <Video/> */}
    
     {/* <VideoMeta/> */}


  </div>
  )
}

export default App
