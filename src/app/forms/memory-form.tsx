import { Button, Field, Input, Label, Textarea } from '@headlessui/react'
import clsx from 'clsx'
import React from 'react'
import InputMask from 'react-input-mask'
import { Memory } from './../routes/root'

interface MemoryFormProps {
  defaultValue?: Memory
  onSubmit?: () => any
}

const MemoryForm: React.FC<MemoryFormProps> = ({ defaultValue, onSubmit }) => {
  const submitData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (onSubmit) {
      onSubmit()
    }

  }

  return (
    <div className='flex flex-col space-y-2'>
      <form onSubmit={submitData} className='mt-4'>
        <Field as='div'>
          <Label className='text-sm/6 font-medium'>Date</Label>
          <InputMask
            mask='99/99/9999'
            defaultValue={'22/05/1992'}
            name='date'
            className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='MM/DD/YYYY'
            default='05/22/1992'
          />
        </Field>
        <Field as='div'>
          <Label className='text-sm/6 font-medium'>Title</Label>
          <Input
            name='title'
            className={clsx(
              'mt-3 block w-full rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
          />
        </Field>

        <Field as='div'>
          <Label className='text-sm/6 font-medium '>Memory</Label>
          <Textarea
            name='description'
            className={clsx(
              'mt-3 block w-full resize-none rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 ',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
            rows={3}
          />
        </Field>
        <div className='mt-4 flex justify-end gap-2'>
          <Button type='submit' className='btn-primary'>
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MemoryForm
