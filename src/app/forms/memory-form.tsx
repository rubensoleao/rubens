import { Button, Field, Input, Label, Textarea } from '@headlessui/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { Memory } from './../routes/root'
import { parse, isValid } from 'date-fns'
import FileUploadInput from '../components/file-upload-input'

interface MemoryFormProps {
  defaultValue?: Memory
  onSubmit?: () => any
}

const MemoryForm: React.FC<MemoryFormProps> = ({ defaultValue, onSubmit }) => {
  const validateDate = (dateString: string) =>
    isValid(parse(dateString, 'MM/dd/yyyy', new Date()))
  const [formError, setFormError] = useState<string | undefined>(undefined)

  const submitData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const nDate = parse(date, 'MM/dd/yyyy', new Date())
    console.log('VALIDATIRON', validateDate(date), date, nDate, isValid(nDate))
    if (!validateDate(date)) {
      setFormError('Invalid Date')
      return
    }

    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className='flex flex-col space-y-2'>
      <form onSubmit={submitData} className='mt-4'>
        <Field as='div' className='mb-4'>
          <Label className=' text-sm/6 font-medium'>Picture</Label>
          <FileUploadInput className='mt-1' />
        </Field>
        <Field as='div' className='mb-4'>
          <Label className='text-sm/6 font-medium'>
            Date{' '}
            <span className=' text-[12px] text-gray-400 pl-1'>
              ( MM/DD/YYYY )
            </span>
          </Label>
          <InputMask
            mask='99/99/9999'
            defaultValue={'22/05/1992'}
            name='date'
            onChange={() => {
              if (formError) {
                setFormError(undefined)
              }
            }} // reset form error
            className={clsx(
              {
                'border-red-400 focus:border-red-600 border-x-8 focus:ring-red-400':
                  formError,
              },
              'mt-1  block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focused-input'
            )}
            placeholder='MM/DD/YYYY'
            default='05/22/1992'
          />
        </Field>
        <Field as='div' className='mb-4'>
          <Label className='text-sm/6 font-medium'>Title</Label>
          <Input
            name='title'
            className={
              'mt-1 block w-full rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 focused-input'
            }
          />
        </Field>

        <Field as='div' className='mb-4'>
          <Label className='text-sm/6 font-medium '>Memory</Label>
          <Textarea
            name='description'
            className={
              'mt-1 block w-full resize-none rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 focused-input'
            }
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
