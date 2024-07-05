import { useEffect, useState } from 'react'
import { Button, Field, Input, Label, Textarea } from '@headlessui/react'
import clsx from 'clsx'
import { fetchUser, updateUser } from '../lib/api-client'
import {  useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

interface UserEditFormProps {
  onSubmit: () => void
}

export default function UserEditForm({ onSubmit }: UserEditFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cookies] = useCookies(['username'])
  const navigate = useNavigate()


  const getUsername = ():string =>{
    const username = cookies.username as undefined | string
    if (username === undefined) {
      console.warn('No session cookie found')
      navigate('/login')
      throw "No username found in cookie"
    }
    return username
  }

  useEffect(() => {
    const username = getUsername()
    fetchUser(username)
      .then((user) => {
        if (user) {
          setName(user.name)
          setDescription(user.description)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const username = getUsername()
    const user = { username, name, description }

    updateUser(user)
    .then(() => {
      onSubmit()
    })
    .catch((err) => {
      console.error(err)
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Field as='div' className='mb-4'>
        <Label className='text-sm font-medium text-gray-700'>Name</Label>
        <Input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={clsx(
            'mt-1 block w-full rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 focused-input'
          )}
        />
      </Field>
      <Field as='div' className='mb-4'>
        <Label className='text-sm font-medium text-gray-700'>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={clsx(
            'mt-1 block w-full resize-none rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 focused-input'
          )}
          rows={6}
        />
      </Field>
      <div className='mt-4 flex justify-end gap-2'>
        <Button type='submit' className='btn-primary'>
          Save
        </Button>
      </div>
    </form>
  )
}
