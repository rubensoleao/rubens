import { Input } from '@headlessui/react'
import clsx from 'clsx'
import React, { useState } from 'react'

interface FileUploadInputProps {
  className?: string
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ className }) => {
  const [file, setFile] = useState<File | undefined>(undefined)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) {
      return
    }
    setFile(e.target.files[0])

    console.log('FILE', e.target.files[0])
  }

  return (
    <Input
      type='file'
      onChange={handleFileChange}
      className={clsx(
        'flex-initial block w-full rounded-lg border max-h-[50px] bg-white/5 py-1.5 px-3 text-sm/6 focused-input',
        className
      )}
    />
  )
}

export default FileUploadInput
