import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import SearchBar from '../SearchBar/SerachBar'
import { useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigate = useNavigate();
  
  const onLogout = () => {
    localStorage.clear()
    navigate("/login")
  }
  
  const handleSearch = () => {
    if(searchQuery) {
      onSearchNote(searchQuery)
      if(mobileMenuOpen) setMobileMenuOpen(false)
    }
  }
  
  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }
  
  return (
    <div className='bg-white shadow-md sticky top-0 '>
      {/* Desktop/Tablet Navbar */}
      <div className='container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 py-3'>
        <div className='flex w-full lg:w-auto justify-between items-center'>
          <h2 className='text-xl md:text-2xl font-bold text-blue-600 py-2'>Aurion</h2>
          
          <button 
            className='lg:hidden flex items-center justify-center'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? 
              <FaTimes className="text-xl text-gray-700" /> : 
              <FaBars className="text-xl text-gray-700" />
            }
          </button>
        </div>
        
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center w-full lg:w-auto mt-4 lg:mt-0 gap-4 transition-all duration-300`}>
          <SearchBar
            value={searchQuery}
            onChange={({target}) => {
              setSearchQuery(target.value)
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
       
          
          <div className="mt-4 lg:mt-0 w-full lg:w-auto flex justify-center">
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar