import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'

const TagInput = ({tags,setTags}) => {
    

    const [inputValue,setInputValue]=useState("")

    const handleInputChange=(e)=>{
        setInputValue(e.target.value)
    }

    const addNewTag=()=>{
        if(inputValue.trim()!==""){
            setTags([...tags,inputValue.trim()])
            setInputValue("");
        }
    }

    const handleKeyDown=(e)=>{
        if(e.key=="Enter"){
            addNewTag();
        }
    }

    const handleRemoveTag=(tagToRemove)=>{
        setTags(tags.filter((tag)=>tag!==tagToRemove))
    }

  return (
    <div>

        {tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
                {tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        #{tag}
                        <button 
                            onClick={() => {  handleRemoveTag(tag)}}
                            className="hover:text-red-500"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        )}

        <div className='flex items-center gap-4 mt-3'>
            <input 
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text" className='text-sm bg-transparent border px-3 py-2 rounded outline-none' placeholder='Dodaj tagi'></input>


            <button className='w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700'>
                <MdAdd
                className='text-2xl text-blue-700 hover:text-white'></MdAdd>
            </button>
        </div>
    </div>
  )
}

export default TagInput