import { Button } from '@headlessui/react'
import { CubeIcon, PencilIcon, ShareIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomDialog from '../components/custom-dialog'
import UserEditForm from '../forms/user-edit-form'
import { fetchUser } from '../lib/api-client'
import MemoryTimeline from '../components/memory-timeline'
import Toast from '../components/toast'

export default function Root() {
  const [cookies, , removeCookie] = useCookies(['username'])
  const location = useLocation()
  const navigate = useNavigate()
  const [userName, setUserName] = useState<string>('')
  const [userDescription, setUserDescription] = useState<string>('')
  const [isUserDialogOpen, setIsUserDialogOpen] = useState<boolean>(false)
  const [isNewUser, setIsNewUser] = useState<string>('Update Your Profile')
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>('')

  const logout = () => {
    removeCookie('username')
    navigate('/login')
  }

  const handleUserSubmit = () => {
    const username = cookies.username as string | undefined
    if (username === undefined) {
      navigate('/login')
      return
    }

    fetchUser(username)
      .then((user) => {
        setUserName(user.name)
        setUserDescription(user.description)
      })
      .catch((err) => {
        console.error(err)
      })
    setIsUserDialogOpen(false)
  }

  const handleShare = () => {
    const fakeLink = `https://memorylane.com/share/${userName}`
    navigator.clipboard.writeText(fakeLink).then(
      () => {
        setToastMessage('Link copied to clipboard! ')
        setIsToastVisible(true)
      },
      (err) => {
        console.error('Failed to copy: ', err)
      }
    )
  }

  useEffect(() => {
    const username = cookies.username as string | undefined

    if (!username) {
      navigate('/login')
      return
    }

    fetchUser(username)
      .then((user) => {
        if (user) {
          setUserName(user.name)
          setUserDescription(user.description)
        } else {
          setIsUserDialogOpen(true)
        }
      })
      .catch((err) => {
        console.error(err)
        // TODO: better handle this type of error
        navigate('/login')
        return
      })

    const isNewUser = location.state?.isNewUser as boolean | undefined
    navigate(location.pathname, { replace: true })

    if (isNewUser) {
      setIsNewUser('Welcome aboard! Create your profile by filling in the details below.')
      setIsUserDialogOpen(true)
      return
    }
  }, [])

  return (
    <div className='min-h-screen'>
      <div className='max-w-3xl mx-auto p-4 h-screen'>
        <Button className='border-none btn-primary absolute right-0 top-0 m-4' onClick={logout}>
          Logout
        </Button>
        <div className='flex items-center justify-center lg:fixed lg:top-4 lg:left-4 md:sticky md:top-0 md:z-10'>
          <CubeIcon className='h-6 w-6 text-black' />
          <p className='text-lg font-semibold text-gray-900 ml-2'>
            Memory Lane
          </p>
        </div>
        <div className='flex items-center justify-between pt-2 mb-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            {userName ? `${userName}'s Memory Lane` : 'Memory Lane'}
          </h1>
          <div>
            <Button className='btn-primary mt-4 mr-2 text-gray-600' onClick={() => setIsUserDialogOpen(true)}>
              <PencilIcon className='w-4 h-4' />
            </Button>
            <Button className='btn-primary' onClick={handleShare}>
              <ShareIcon className='w-4 h-4' />
            </Button>
          </div>
        </div>
        <div className='break-words'>
          <p className='text-gray-700 mb-8'>
            {userDescription || 'User description goes here.'}
          </p>
        </div>
        <MemoryTimeline
          isEditable={true}
        />
      </div>
      <CustomDialog
        isOpen={isUserDialogOpen}
        title={isNewUser}
        onClose={() => setIsUserDialogOpen(false)}
      >
        <UserEditForm onSubmit={handleUserSubmit} />
      </CustomDialog>
      <Toast
        message={toastMessage}
        show={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  )
}
