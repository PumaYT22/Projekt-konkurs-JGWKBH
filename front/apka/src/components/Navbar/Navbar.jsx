import React,{useState} from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import SerachBar from '../SearchBar/SerachBar'
import {useNavigate} from 'react-router-dom'

const Navbar = ({userInfo}) => {

  const [serachQuery,setSerachQuery]=useState("")

  const navigate= useNavigate();

  const onLogout=() =>{
    localStorage.clear()
    navigate("/login")
  }

  const handleSerach=()=>{

  }

  const onClearSerach=()=>{
    setSerachQuery("")
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>Aurion</h2>

        <SerachBar
          value={serachQuery}
          onChange={({target})=>{
            setSerachQuery(target.value)
          }}
          handleSerach={handleSerach}
          onClearSerach={onClearSerach}
        ></SerachBar>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}></ProfileInfo>
    </div>
  )
}

export default Navbar