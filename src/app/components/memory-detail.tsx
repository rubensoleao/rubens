import { Button } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import CustomDialog from '../components/custom-dialog'
import MemoryForm from '../forms/memory-form'
import { Memory } from '../routes/root'

interface MemoryDetailDialogProps {
  memory: Memory
  isOpen: boolean
  onClose: () => void
}

export default function MemoryDetailDialog({
  memory,
  isOpen,
  onClose,
}: MemoryDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditSubmit = () => {
    setIsEditDialogOpen(false)
    onClose() // close detail dialog after editing
  }

  return (
    <>
      <CustomDialog isOpen={isOpen} title='' onClose={onClose}>
        <div className='flex space-x-4 '>
          <div className='w-1/3'>
            <img
              src={'http://127.0.0.1:4001' + memory.imageUrl}
              alt='Memory'
              className='w-full h-auto object-cover'
            />
          </div>
          <div className='w-2/3'>
            <h2 className='text-xl font-bold'>{memory.title}</h2>
            <p className='text-gray-500'>{memory.date}</p>
            <p className='mt-2 text-gray-700'>{memory.description}</p>

          </div>
          <div className='relative text-gray-600'>
              <Button
                className='btn-secondary absolute bottom-1 right-1 float-right'
                onClick={() => setIsEditDialogOpen(true)}
              >
                <PencilIcon className='w-4 h-4' />
              </Button>
            </div>
        </div>
      </CustomDialog>
      <CustomDialog
        isOpen={isEditDialogOpen}
        title='Edit Memory'
        onClose={() => setIsEditDialogOpen(false)}
      >
        <MemoryForm defaultValue={memory} onSubmit={handleEditSubmit} edit={true} />
      </CustomDialog>
    </>
  )
}
