import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SerachBar = ({value,onChange,handleSerach,onClearSerach}) => {
  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
        <input
            className='w-full text-xs bg-transparent py-[11px] outline-none'
            type="text"
            placeholder='Wyszukaj Rozmowy'
            value={value}
            onChange={onChange}
        >
        
        </input>

        {value && (<IoMdClose className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" onClick={onClearSerach}/>)}

        <FaMagnifyingGlass
            className='text-slate-400 cursor-pointer hover:text-black'
            onClick={handleSerach}
        ></FaMagnifyingGlass>
    </div>
  )
}

export default SerachBar