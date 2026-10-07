import React, { useEffect } from 'react'
import {Navigate, Route,Routes} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import getCurrentUser from './customHooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import Profile from './pages/Profile'
import getOtherUsers from './customHooks/getOtherUser'
import { io } from "socket.io-client"
import { serverUrl } from './config'
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App(){
  getCurrentUser()
  getOtherUsers()
  let {userData,socket,onlineUsers} = useSelector(state=>state.user)
  let dispatch = useDispatch()

  useEffect(() => {
    if (!userData?._id) {
        return;
    }
    
    const socketio = io(serverUrl, {
        query: {
            userId: userData._id
        }
    });

    socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
    });

    dispatch(setSocket(socketio));

    return () => {
        socketio.disconnect();
    };

}, [userData?._id]);

  return(
      <Routes>
        <Route path='/login' element={!userData?<Login/>:<Navigate to="/"/>}/>
        <Route path='/signup' element={!userData?<SignUp/>:<Navigate to="/profile"/>}/>
        <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
        <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>}/>
      </Routes>
  
  )
}

export default App
