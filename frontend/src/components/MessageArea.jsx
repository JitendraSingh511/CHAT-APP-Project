import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import dp from "../assets/dp.png"
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { BsEmojiSmile } from "react-icons/bs";
import { BsCardImage } from "react-icons/bs";
import { LuSendHorizontal } from "react-icons/lu";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from "./senderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../config";
import { setMessages } from "../redux/messageSlice";


function MessageArea(){
    let image=useRef()
    let {messages} = useSelector(state=>state.message)
    let {selectedUser,userData,socket} = useSelector(state=>state.user)
    let dispatch = useDispatch()
    let [showPicker,setShowPicker] = useState(false)
    let [input,setInput] = useState("")
    let [frontendImage,setFrontendImage] = useState(null)
    let [backendImage,setBackendImage] = useState(null)

    const handleImage=(e)=>{
        let file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMessage=async (e)=>{
      e.preventDefault()
      if(input.length==0 && backendImage==null){
        return 
      }
      try {
        let formData=new FormData()
        formData.append("message",input)
        if(backendImage){
          formData.append("image",backendImage)
        }
        let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
        dispatch(setMessages([...messages,result.data]))
        setInput("")
        setFrontendImage(null)
        setBackendImage(null)
      } catch (error) {
        console.log(error)
      }
    }
    
    const onEmojiClick = (emojiData)=>{
        setInput(prevInput=>prevInput+emojiData.emoji)
        setShowPicker(false)
    }

    useEffect(()=>{
        socket?.on("newMessage",(mess)=>{
            dispatch(setMessages([...messages,mess]))
    })
    return ()=>socket?.off("newMessage")
    },[messages,setMessages])

    return( 
        <div className={`lg:w-[70%] relative   ${selectedUser?"flex":"hidden"} lg:flex  w-full h-full bg-slate-200 border-l-2 border-gray-300 overflow-hidden`}>

        {selectedUser && 
        <div className='w-full h-[100vh] flex flex-col overflow-hidden gap-[20px] items-center'>
        <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-gray-400 shadow-lg gap-[20px] flex items-center px-[20px] '>  
             <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}>
                <IoArrowBack className='w-[40px] h-[40px] text-white'/>
            </div> 
            <div className='w-[50px] h-[50px] bg-white rounded-full overflow-hidden flex justify-center
            items-center shadow-gray-700 shadow-lg cursor-pointer'>
                <img src={selectedUser?.image || dp} alt="" className='h-[100%]'/>
            </div> 
            <h1 className="text-white semi-bold text-[20px]">{selectedUser?.name || "user"}</h1>            
        </div>
        <div className="w-full h-[550px] flex flex-col px-[40px] overflow-auto gap-[20px]">
            {showPicker && 
              <div className='absolute bottom-[120px] left-[20px]'><EmojiPicker width={250} height={350} className='shadow-lg z-[100]'
              onEmojiClick={onEmojiClick}/></div>
            }

            {messages && messages.map((mess)=>(
              mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>:<ReceiverMessage image={mess.image} message={mess.message}/>
            ))}

        </div>
        </div>
        }

        {selectedUser && 
        <div className='w-full lg:w-[72%] h-[100px] fixed bottom-[20px] flex items-center justify-center '>
            <img src={frontendImage} alt="" className="w-[80px] absolute bottom-[100px] right-[20%] rounded-lg
            shadow-gray-400 shadow-lg"/>
            <form className='w-[95%] lg:w-[80%] h-[55px] bg-[rgb(23,151,194)] shadow-gray-400 shadow-lg rounded-full flex items-center 
                gap-[20px] px-[20px] mt-[75px] relative' onSubmit={handleSendMessage}>
                <div onClick={()=>setShowPicker(prev=>!prev)}>
                    <BsEmojiSmile className="w-[25px] h-[25px] text-white cursor-pointer"/>
                </div>
                <input type="file" accept="image/*" ref={image} hidden onChange={handleImage} />
                <input type="text" className="w-full h-full px-[10px] outline-none
                border-0 text-[19px] text-white bg-transparent placeholder-white" placeholder="Message"
                onChange={(e)=>setInput(e.target.value)} value={input}/>
                <div onClick={()=>image.current.click()}>
                    <BsCardImage className="w-[25px] h-[25px] text-white cursor-pointer"/>
                </div>
                {(input.length>0 || backendImage!=null) && (<button>
                    <LuSendHorizontal className="w-[25px] h-[25px] text-white"/>
                  </button>)}
            </form>
        </div>
        
        }    

        {!selectedUser && 
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className='text-gray-700 font-bold text-[50px]'>Welcome to Chatly</h1>
          <span className="text-gray-700 font-semibold text-[30px]">Chat Friendly!</span>
        </div>}
        </div>
    )
}

export default MessageArea