
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'
import MemoryDetailDialog from '../components/memory-detail'

interface MemoryCardProps {
    id: number
    title: string
    date: string
    description: string
    imageUrl: string
  }
export function MemoryCard(memory: MemoryCardProps) {
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const apiUrl = import.meta.env.VITE_API_URL
  
    return (
      <div>
        <div className=''>
          <Transition
            as='div'
            show={true}
            enter='transition-all duration-300 ease-in-out'
            enterFrom='transform scale-100'
            enterTo='transform scale-100'
            leave='transition-all duration-300 ease-in-out'
            leaveFrom='transform scale-100'
            leaveTo='transform scale-100'
            className='bg-white shadow rounded-lg p-4 mb-4 cursor-pointer flex h-[180px] overflow-hidden'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsDetailDialogOpen(true)}
          >
            <div
              className={clsx(
                'h-auto rounded-lg overflow-hidden transition-all duration-300 ease-in-out',
                isHovered ? 'w-[200px] max-w-[200px]' : 'w-[80px] max-w-[80px]'
              )}
            >
              <img
                src={apiUrl + memory.imageUrl}
                alt='Memory'
                className='h-full w-full object-cover'
              />
            </div>
            <div className='ml-4 flex-1 transition-all duration-300 ease-in-out relative'>
              <h2 className='text-xl font-bold'>{memory.title}</h2>
              <p className='text-gray-500'>{memory.date}</p>
              <div className='inherit max-h-[150px] overflow-hidden'>
                <p className='mt-2 text-gray-700'>{memory.description}</p>
                <div className='absolute bottom-[-20px] left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent'></div>
              </div>
            </div>
          </Transition>
        </div>
        <MemoryDetailDialog  // TODO: optimize MemoryDetailDialog (put in parent component) to avoid multple dialogs
          memory={memory}
          isOpen={isDetailDialogOpen}
          onClose={() => {
            setIsDetailDialogOpen(false)
          }}
        />
      </div>
    )
  }
  