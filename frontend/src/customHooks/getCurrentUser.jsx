import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../config.js"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"

const getCurrentUser=()=>{
    let dispatch = useDispatch()
    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                let result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                dispatch(setUserData(result.data))
            }
            catch(error){
                console.log(error)
            }
        }
        fetchUser()
    },[])
}

export default getCurrentUser