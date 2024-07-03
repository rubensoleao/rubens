import { useEffect } from 'react'
import { Transition } from '@headlessui/react'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000) // Hide after 3 seconds
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <Transition
      show={show}
      enter='transition ease-out duration-300'
      enterFrom='opacity-0 translate-y-2'
      enterTo='opacity-100 translate-y-0'
      leave='transition ease-in duration-200'
      leaveFrom='opacity-100 translate-y-0'
      leaveTo='opacity-0 translate-y-2'
    >
      <div className='fixed bottom-4 right-4  bg-green-600 text-white p-4 rounded-lg shadow-lg '>
        <div>{message}</div>
      </div>
    </Transition>
  )
}

export default Toast
