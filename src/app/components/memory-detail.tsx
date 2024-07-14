import { Button } from '@headlessui/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import CustomDialog from '../components/custom-dialog'
import MemoryForm from '../forms/memory-form'
import { deleteMemory } from '../lib/api-client'
import { Memory } from '../../types' 

interface MemoryDetailDialogProps {
  memory: Memory
  isOpen: boolean
  onClose: () => void
  isEditable: boolean
}

export default function MemoryDetailDialog({
  memory,
  isOpen,
  onClose,
  isEditable = true,
}: MemoryDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditSubmit = () => {
    setIsEditDialogOpen(false)
    onClose() // close detail dialog after editing
  }

  const handleEditMemory = () => {
    if (!isEditable) {
      console.error('Tried to edit an uneditable memory')
      return
    }

    setIsEditDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!isEditable) {
      console.error('Tried to delete an uneditable memory')
      return
    }
    try {
      await deleteMemory(memory.id)
      onClose() // close detail dialog after deleting

      // TODO: Remove memory from memories instead of reload
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const apiUrl = import.meta.env.VITE_API_URL

  return (
    <>
      <CustomDialog isOpen={isOpen} title='' onClose={onClose}>
        <div className='flex space-x-4 mr-6 h-auto'>
          <div className='w-1/3'>
            <img
              src={apiUrl + memory.imageUrl}
              alt='Memory'
              className='w-full h-auto object-cover'
            />
          </div>
          <div className='w-2/3 '>
            <h2 className='text-xl font-bold break-words'>{memory.title}</h2>
            <p className='text-gray-500'>{memory.date}</p>
            <p className='mt-2 text-gray-700 break-words'>
              {memory.description}
            </p>
          </div>
          {isEditable && (
            <div className='relative text-gray-600'>
              <Button
                className='btn-secondary absolute bottom-1 right-1 float-right'
                onClick={handleEditMemory}
              >
                <PencilIcon className='w-4 h-4' />
              </Button>
              <Button
                className='absolute bottom-1 right-10 float-right'
                onClick={handleDelete}
              >
                <TrashIcon className='w-4 h-4' />
              </Button>
            </div>
          )}
        </div>
      </CustomDialog>
      <CustomDialog
        isOpen={isEditDialogOpen}
        title='Edit Memory'
        onClose={() => setIsEditDialogOpen(false)}
      >
        <MemoryForm
          defaultValue={memory}
          onSubmit={handleEditSubmit}
          edit={true}
        />
      </CustomDialog>
    </>
  )
}
