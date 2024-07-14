import { CubeIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { createUser, fetchUser } from '../lib/api-client'
import { Button } from '@headlessui/react'

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [, setCookie] = useCookies(['username'])

  const handleFormSubmit = (event: any) => {
    event.preventDefault()
    const formType = event?.nativeEvent?.submitter?.name

    if (formType === 'login') {
      handleLogin()
    } else if (formType === 'createuser') {
      handleCreateUser()
    }
  }

  const handleLogin = async () => {
    try {
      const data = await fetchUser(username)
      setError('')
      setMessage(
        `Welcome back, ${data.name}! Let's create some wonderful memories.`
      )

      setCookie('username', data.username)
      navigate('/', { state: { isNewUser: false } })
    } catch (err: any) {
      console.error(err)
      if (err.response && err.response.status === 404) {
        setError('User not found')
        setMessage('')
      } else {
        setError('An error occurred')
        setMessage('')
      }
      null
    }
  }

  const handleCreateUser = () => {
    setError('')
    createUser(username, username, 'My memory lane')
      .then(() => {
        setCookie('username', username)
        navigate('/', { state: { isNewUser: true } })
        return
      })
      .catch((err) => {
        console.error(err)
        setError('An error occurred while creating the user')
        setMessage('')
        return
      })
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white border shadow-md rounded-xl'>
        <div className='flex'>
          <CubeIcon className='h-6 w-6 mr-4 text-black' />
          <h3 className='text-base/7 font-medium text-black mb-4'>
            Welcome to Memory Lane
          </h3>
        </div>
        <p className='text-sm text-gray-600 mb-6'>
          A place where you can store and share your cherished memories with
          friends and family.
        </p>
        <form onSubmit={handleFormSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Username
            </label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='mt-1 block w-full p-2 border rounded-md'
              required
            />
          </div>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          {message && <p className='text-green-500 text-sm mb-4'>{message}</p>}
          <div className='flex justify-between'>
            <Button
              type='submit'
              name='createuser'
              className='w-5/12 btn-primary mb-4'
            >
              Create User
            </Button>
            <Button
              type='submit'
              name='login'
              className='w-5/12 btn-primary bg-black text-white mb-4 hover:text-black'
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen
