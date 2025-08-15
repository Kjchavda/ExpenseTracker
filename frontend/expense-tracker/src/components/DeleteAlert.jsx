import React from 'react'

export const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div>
        <p className='text-sm'> {content}</p>
        <div className='flex justify-end mt-6'>
            <button
                type='button'
                onClick={onDelete}
                className='add-btn add-btn-fill'
            >
                Delete
            </button>
        </div>
    </div>
  )
}
