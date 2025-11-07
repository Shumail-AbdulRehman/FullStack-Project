import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner';

function AuthLayout({children,authentication=true}) {

    const navigate=useNavigate();
    const isAuthenticated=useSelector((state)=> state.auth.isAuthenticated);
    const [loading,setLoading]=useState(false);

    useEffect(()=>
    {
        setLoading(true);
        if(authentication && isAuthenticated !== authentication){
            navigate("/login")
        } else if(!authentication && isAuthenticated !== authentication){
            navigate("/")
        }
        setLoading(false)

    },[isAuthenticated,authentication,navigate])

    if(loading)
    {
        return <LoadingSpinner/>
    }
    else
    {
        return (
            <div>
                {children}
            </div>
        )
    }
  
}

export default AuthLayout
