import { CubeIcon } from '@heroicons/react/20/solid'
import './root.css'

export default function Root() {
  return (
    <div>
        <div className='flex items-center'>
          <CubeIcon className='h-4 w-4 inline-block' />
          <h1 className='text-2xl font-semibold text-gray-900 mb-4 ml-4 mt-4'>
            Memory lanes
          </h1>
        </div>
    </div>
  )
}