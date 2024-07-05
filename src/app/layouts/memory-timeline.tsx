import { CubeIcon } from '@heroicons/react/20/solid'
import { Outlet } from 'react-router-dom'
import React from 'react'

const MemoryTimelineLayout: React.FC = () => {
  return (
    <div className='min-h-screen min-w-screen'>
      <div className='mx-auto p-4 h-screen  '>
        <div className='flex items-center justify-center lg:fixed lg:top-4 lg:left-4 md:sticky md:top-0 md:z-10'>
          <CubeIcon className='h-6 w-6 text-black' />
          <p className='text-lg font-semibold text-gray-900 ml-2'>
            Memory Lane
          </p>
        </div>
        <div className='flex flex-col bg-blue items-center justify-center pt-2 mb-4 '>
          <div className=' md:min-w-[800px]'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryTimelineLayout
