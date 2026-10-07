import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config.js"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers, setUserData } from "../redux/userSlice"
import { setMessages } from "../redux/messageSlice.js"

const getMessage=()=>{
    let dispatch = useDispatch()
    let {userData,selectedUser} = useSelector(state=>state.user)
    useEffect(()=>{
        const fetchMessages = async()=>{
             if (!selectedUser?._id){
                return;
             } 
            try{
                console.log("📤 Fetching messages for:", selectedUser._id);
                let result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`,{withCredentials:true})
                dispatch(setMessages(result.data))
            }
            catch(error){
                if (error.response?.data?.message === "Conversation not found") {
                    dispatch(setMessages([])); // empty chat
                } else {
                    console.error("❌ Error fetching messages:", error.response?.data || error);
                }
            }
        }
        fetchMessages()
    },[selectedUser,userData])
}

export default getMessage