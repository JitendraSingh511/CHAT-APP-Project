import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.png"
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from "../redux/userSlice";
import { serverUrl } from "../config";

function SideBar(){
    let {userData,otherUsers,selectedUser,onlineUsers} = useSelector(state=>state.user)
    let [search,setSearch] = useState(false)
    let [input,setInput] = useState("")
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const handleLogOut = async()=>{
        try{
            let result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate("/login")
        }
        catch(error){
            console.log(error)
        }
    }

    const handleSearch = async()=>{
        try{
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
        }
        catch(error){
            console.log(error)
        }
    }
    
    useEffect(()=>{
        if(input){
            handleSearch()
        }
    },[input])
     
    return(
        <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 ${!selectedUser?"block":"hidden"}`}>
            <div className='w-[60px] h-[60px] mt-[10px] bg-[#20c7ff] text-gray-700 rounded-full overflow-hidden flex justify-center
            items-center shadow-gray-700 shadow-lg cursor-pointer fixed bottom-[20px] left-[10px]' onClick={handleLogOut}>
               <RiLogoutCircleLine className="w-[25px] h-[25px]"/> 
            </div>
            <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%]
            shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]'>
                <h1 className="text-white font-bold text-[25px]">Chat</h1>
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-gray-800 font-bold text-[25px]">Hii , {userData.name || "user"}</h1>
                    <div className='w-[60px] h-[60px] bg-white rounded-full overflow-hidden flex justify-center
                       items-center shadow-gray-700 shadow-lg cursor-pointer' onClick={()=>navigate("/profile")}>
                    <img src={userData.image || dp} alt="" className='h-[100%]' />
                </div>
                </div>
                <div className="w-full flex items-center gap-[20px]"> 
                    {!search && <div className='w-[60px] h-[60px] bg-white rounded-full overflow-hidden flex justify-center
                    items-center shadow-gray-700 shadow-lg mt-[10px] cursor-pointer'onClick={()=>setSearch(true)}>
                    <IoSearchOutline className="w-[25px] h-[25px]"/> </div>}

                    {search && 
                        <form className="w-full h-[60px] bg-white shadow-gray-700 shadow-lg flex items-center gap-[10px]
                        mt-[10px] rounded-full overflow-hidden px-[20px]"> 
                            <IoSearchOutline className="w-[25px] h-[25px]"/>
                            <input type="text" placeholder="Search Users..." className="w-full h-full 
                            p-[10px] text-[17px] outline-0 border-0" onChange={(e)=>setInput(e.target.value)} value={input}/>
                            <RxCross2 className="w-[25px] h-[25px] cursor-pointer" onClick={()=>setSearch(false)}/>
                        </form>
                    }

                    {!search && otherUsers?.map((user)=>(
                        onlineUsers?.includes(user._id) &&
                        <div className="relative rounded-full shadow-gray-500 bg-white
                        shadow-lg flex justify-center items-center mt-[10px] cursor-pointer" onClick={()=>{dispatch(setSelectedUser(user))}}>
                        <div className='w-[60px] h-[60px] bg-white rounded-full overflow-hidden flex justify-center
                          items-center shadow-gray-700 shadow-lg'>
                           <img src={user.image || dp} alt="" className='h-[100%]'/>
                        </div>
                            <span className="w-[12px] h-[12px] rounded-full absolute
                            bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md"></span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full h-[50%] overflow-auto flex flex-col gp-[20px] items-center mt-[20px]">
                {otherUsers?.map((user)=>(
                    <div className="w-[95%] h-[60px] flex justify-start
                    items-center gap-[20px] shadow-gray-500 bg-white shadow-lg
                    rounded-full hover:bg-[#b2ccdf] cursor-pointer mt-[10px]" onClick={()=>{dispatch(setSelectedUser(user))}}>
                        <div key={user._id || user.id || user.email}
                         className='w-[60px] h-[60px] bg-white rounded-full overflow-hidden flex justify-center
                          items-center shadow-gray-700 shadow-lg'>
                           <img src={user.image || dp} alt="" className='h-[100%]' />
                        </div>
                        <h1 className="text-gray-800 semi-bold text-[20px]">{user.name || user.userName}</h1>
                    </div>   
                ))}
            </div>
        </div>
    )
}

export default SideBar