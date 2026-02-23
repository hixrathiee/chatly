import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.jpeg"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import axios from 'axios';
import { serverUrl } from '../main';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {

    let { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [input, setInput] = useState("")
    let navigate = useNavigate()
    let dispatch = useDispatch()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate("/login")
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (input) handleSearch()
    }, [input])

    return (
        <div className={`lg:w-[30%] w-full h-full flex flex-col bg-slate-100 ${selectedUser ? "hidden lg:flex" : "flex"}`}>
            {/* Header */}
            <div className='bg-[#20c7ff] rounded-b-[50px] shadow-md px-6 py-8 flex flex-col gap-8'>

                <h1 className='text-white font-bold text-3xl tracking-wide'>
                    chatly
                </h1>

                <div className='flex justify-between items-center'>
                    <h2 className='text-white font-semibold text-xl'>
                        Hey, {userData?.name || "user"}
                    </h2>

                    <div
                        onClick={() => navigate("/profile")}
                        className='w-14 h-14 rounded-full overflow-hidden shadow-md cursor-pointer ring-2 ring-white'
                    >
                        <img
                            src={userData?.image || dp}
                            alt=""
                            className='w-full h-full object-cover'
                        />
                    </div>
                </div>

                {/* Search */}
                {!search ? (
                    <div
                        className='w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition'
                        onClick={() => setSearch(true)}
                    >
                        <IoIosSearch className='w-6 h-6 text-gray-700' />
                    </div>
                ) : (
                    <div className='flex items-center bg-white rounded-full px-5 py-3 shadow-md'>
                        <IoIosSearch className='w-5 h-5 text-gray-500' />
                        <input
                            type="text"
                            placeholder='Search users...'
                            className='flex-1 px-3 outline-none text-gray-700 text-lg'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <RxCross2
                            className='w-5 h-5 cursor-pointer text-gray-500'
                            onClick={() => {
                                setSearch(false)
                                setInput("")
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Search Results Dropdown */}
            {input.length > 0 && (
                <div className='absolute top-[220px] left-0 w-full bg-white shadow-lg z-50 max-h-[400px] overflow-y-auto'>
                    {searchData?.map((user) => (
                        <div
                            key={user._id}
                            className='flex items-center gap-4 px-5 py-4 hover:bg-slate-100 cursor-pointer border-b border-slate-200'
                            onClick={() => {
                                dispatch(setSelectedUser(user))
                                setInput("")
                                setSearch(false)
                            }}
                        >
                            <div className='relative'>
                                <div className='w-14 h-14 rounded-full overflow-hidden shadow-sm ring-1 ring-slate-200'>
                                    <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
                                </div>
                                {onlineUsers?.includes(user._id) && (
                                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white'></span>
                                )}
                            </div>
                            <h3 className='text-gray-800 font-medium text-lg'>
                                {user.name || user.userName}
                            </h3>
                        </div>
                    ))}
                </div>
            )}

            {/* Users List */}
            <div className='flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5'>

                {otherUsers?.map((user) => (
                    <div
                        key={user._id}
                        className='flex items-center gap-5 bg-white px-5 py-4 rounded-2xl shadow-md hover:bg-slate-100 cursor-pointer transition-all duration-200 hover:shadow-lg'
                        onClick={() => dispatch(setSelectedUser(user))}
                    >
                        <div className='relative'>
                            <div className='w-14 h-14 rounded-full overflow-hidden shadow-sm ring-1 ring-slate-200'>
                                <img src={user.image || dp} alt="" className='w-full h-full object-cover' />
                            </div>

                            {onlineUsers?.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white'></span>
                            )}
                        </div>

                        <h3 className='text-gray-800 font-semibold text-lg'>
                            {user.name || user.userName}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Logout Section */}
            <div className='p-5 border-t border-slate-200 bg-white'>
                <button
                    onClick={handleLogOut}
                    className='w-full flex items-center justify-center gap-3 bg-[#20c7ff] text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200 text-lg font-medium focus:outline-none'
                >
                    <BiLogOutCircle className='w-6 h-6' />
                    Logout
                </button>
            </div>

        </div>
    )
}

export default SideBar