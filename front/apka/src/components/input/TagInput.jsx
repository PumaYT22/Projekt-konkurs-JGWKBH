import React from 'react'
import { MdAdd } from 'react-icons/md'

const TagInput = ({tags,setTags}) => {
  return (
    <div>
        <div>
            <input type="text" className='text-sm bg-transparent border px-3 py-4' placeholder=''></input>


            <button>
                <MdAdd
                className='text-2xl text-blue-700 hover:text-white'></MdAdd>
            </button>
        </div>
    </div>
  )
}

export default TagInput