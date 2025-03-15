import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='w-full lg:w-80 flex items-center px-4 bg-slate-100 rounded-lg border border-slate-200 hover:border-blue-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200'>
      <input
        className='w-full text-sm bg-transparent py-3 outline-none placeholder-slate-400'
        type="text"
        placeholder='Wyszukaj notatki...'
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />
      
      {value && (
        <IoMdClose 
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" 
          onClick={onClearSearch}
        />
      )}
      
      <FaMagnifyingGlass
        className='text-slate-400 cursor-pointer hover:text-blue-600 transition-colors'
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar