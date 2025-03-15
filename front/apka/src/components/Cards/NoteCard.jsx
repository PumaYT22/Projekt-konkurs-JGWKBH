import React from 'react'
import {MdOutlinePushPin} from 'react-icons/md'
import moment from 'moment'
import { MdCreate, MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const NoteCard = ({
  id,
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    
    if (e.target.closest('.action-btn')) {
      return;
    }
    navigate(`/note/${id}`);
  };

  return (
    <div 
      className='border rounded p-3 sm:p-4 bg-white hover:shadow-xl transition-all ease-in-out h-full flex flex-col cursor-pointer'
      onClick={handleCardClick}
    >
      <div className='flex items-start sm:items-center justify-between'>
        <div className='flex-1 pr-2'>
          <h6 className='text-sm sm:text-base font-medium line-clamp-2'>{title}</h6>
          <span className='text-xs text-slate-500'>{moment(date).format('Do MMM YYYY')}</span>
        </div>
        <MdOutlinePushPin 
          className={`icon-btn action-btn text-xl sm:text-2xl cursor-pointer ${isPinned ? 'text-blue-700' : 'text-slate-300'}`} 
          onClick={(e) => {
            e.stopPropagation();
            onPinNote();
          }}
        />
      </div>
      
      <p className='text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 flex-grow'>{content?.slice(0, 100)}</p>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-2'>
        <div className='text-xs text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide'>
          {tags.map((item, index) => (
            <span key={index} className="mr-1">#{item}</span>
          ))}
        </div>
      
        <div className='flex items-center gap-2 justify-end'>
          <MdCreate
            className='icon-btn action-btn text-lg sm:text-xl hover:text-green-600 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
          <MdDelete
            className='icon-btn action-btn text-lg sm:text-xl hover:text-red-600 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default NoteCard