import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import LogoutBtn from './LogoutBtn'

function Navbar() {

  const isAuthenticated=(useSelector((state)=> state.auth.isAuthenticated))
// const isAuthenticated=useSelector((state)=>  state.auth.isAuthenticated)
console.log("is authenticated",isAuthenticated)

  // useEffect(()=>
  // {
  //   console.log(isAuthenticated)
  // },[isAuthenticated])
 return (
    <div className="flex items-center justify-between px-4 py-6 bg-[#212121] border-b-1 border-gray-400 text-white shadow-md">
      <div className="text-xl font-bold cursor-pointer">MyTube</div>

      <div className="relative flex-1 max-w-xl mx-6">
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search"
          className="w-full border border-gray-600 bg-[#121212] text-white pl-10 pr-4 py-2 rounded-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-400 outline-none transition"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      <div>
        {isAuthenticated ? <LogoutBtn /> : <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>}
      </div>
    </div>
  )
}

export default Navbar
