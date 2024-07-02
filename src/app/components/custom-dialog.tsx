import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { ReactNode, FormEvent } from 'react'

interface CustomDialogProps {
  isOpen: boolean
  title: string
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  onClose: () => void
  children: ReactNode
  submitText?: string
  cancelText?: string
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  title,
  children,
  onSubmit,
  onClose,
  submitText = 'Submit',
  cancelText = 'Cancel',
}) => {
  return (
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
            <DialogTitle as='h3' className='text-base/7 font-medium text-black'>
              {title}
            </DialogTitle>
            <form onSubmit={onSubmit} className='mt-4'>
              {children}
              <div className='mt-4 flex justify-end gap-2'>
                <Button
                  className='btn-primary'
                  onClick={() => onClose()}
                >
                  {cancelText}
                </Button>
                {onSubmit && (
                  <Button
                    type='submit'
                    className='btn-primary'
                  >
                    {submitText}
                  </Button>
                )}
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CustomDialog
