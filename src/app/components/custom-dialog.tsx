import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import React, { Fragment, ReactNode } from 'react'

interface CustomDialogProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  return (
    <div>
      <Transition as={Fragment} show={isOpen}>
        <div
          className={clsx([
            // Base styles
            'fixed inset-0  bg-white transition  ease-in-out opacity-50 ',
            // Shared closed styles
            'data-[closed]:opacity-0',
            // Entering styles
            'transition ease-out duration-150',
            // Leaving styles
            'transition ease-in duration-200',
          ])}
        >
          {' '}
        </div>
      </Transition>
      <Dialog
        open={isOpen}
        as='div'
        className='relative z-10 focus:outline-none'
        onClose={onClose}
      >
        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 sm:p-0'>
            <DialogPanel
              transition
              className='w-full sm:max-w-md border shadow-md rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0'
            >
              <div className='relative'>
                <Button
                  className=' absolute border-none btn-primary top-0 right-0'
                  onClick={() => onClose()}
                >
                  <XMarkIcon className='w-4 h-4'></XMarkIcon>
                </Button>
              </div>
              <DialogTitle
                as='h3'
                className='text-base/7 font-medium text-black'
              >
                {title}
              </DialogTitle>
              {children}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default CustomDialog
