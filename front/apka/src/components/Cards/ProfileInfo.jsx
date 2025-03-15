import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) return null;

  return (
    <div className='flex items-center gap-3 w-full lg:w-auto justify-center transition-all'>
      <div className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white font-medium bg-blue-600 shadow-sm'>
        {getInitials(userInfo?.fullName)}
      </div>
      <div>
        <p className='text-sm sm:text-base font-medium'>{userInfo?.fullName}</p>
        <button 
          className='text-xs sm:text-sm text-slate-700 hover:text-blue-600 transition-colors' 
          onClick={onLogout}
        >
          Wyloguj
        </button>
      </div>
    </div>
  )
}

export default ProfileInfo