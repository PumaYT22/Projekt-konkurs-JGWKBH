import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance'
import { ToastContainer, toast } from 'react-toastify';

const AddEditNotes = ({getAllNotes,noteData,type,onClose,showToastMessage}) => {
    const [title,setTitle]=useState(noteData?.title || "")
    const [content,setContent]=useState(noteData?.content || "")
    const [tags,setTags]=useState(noteData?.tags || [])

    const [error,setError]=useState(null)


    const addNewNote=async ()=>{
        
        try{
            const response=await axiosInstance.post("/add-note",{
                title,content,tags
            })
    
            if(response.data && response.data.note){
                   
                    toast.success("Dodano notatke!");
                    getAllNotes()
                    onClose()
            }
        }catch(error){
            if(error.response && error.response.data &&
                error.response.data.message
            ){
                setError(error.response.data.message)
            }
        }
       
    }
    const editNote=async ()=>{
        const noteId=noteData._id
        try{
            const response=await axiosInstance.put("/edit-note/"+noteId,{
                title,content,tags
            })
    
            if(response.data && response.data.note){
                    toast.success("Zaktualizowano notatke!");
                    getAllNotes()
                    onClose()
            }
        }catch(error){
            if(error.response && error.response.data &&
                error.response.data.message
            ){
                setError(error.response.data.message)
            }
        }
    }

    const handleAddNote=()=>{
        if(!title){
            setError("Podaj tytuł!")
            return;
        }

        if(!content){
            setError("Podaj tytuł!")
            return;
        }

        setError("")

        if(type==="edit"){
            editNote()
        }
        else{
            addNewNote()
        }
    }
  return (
    <div  className='relative'>
        <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500'
        onClick={onClose}> 
            <MdClose className='text-xl text-slate-400'></MdClose>
        </button>

        <div className='flex flex-col gap-2'>
            <label className='input-label' htmlFor="">Tytul</label>
            <input type="text" 
                className='text-2xl text-slate-950 outline-none'
                placeholder='Tytul'
                onChange={({target})=>setTitle(target.value)}
            />
        </div>

        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>Opis</label>
            <textarea name="" id=""
                type="text"
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='Opis'
                row={10}
                onChange={({target})=>setContent(target.value)}
            ></textarea>
        </div>

        <div className='mt-3'>
            <label htmlFor="" className='input-label'>Tag</label>
            <input type="text" 
                className='text-2xl text-slate-950 outline-none'
                placeholder='Tagi'
                onChange={({target})=>setTags(target.value)}
            />
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-5 p-3'
        onClick={handleAddNote}>
                {type === 'edit' ? 'Zaktualizuj': "Dodaj"}
        </button>
    </div>
  )
}

export default AddEditNotes