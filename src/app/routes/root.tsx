import { Button, Transition } from '@headlessui/react'
import { CubeIcon, PencilIcon, ShareIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import CustomDialog from '../components/custom-dialog'
import MemoryDetailDialog from '../components/memory-detail'
import Toast from '../components/toast'
import MemoryForm from '../forms/memory-form'
import UserEditForm from '../forms/user-edit-form'
import { fetchMemories, fetchUser } from '../lib/api-client'
import DropdownMenu from './../components/dropdown-menu'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

interface NavigationState {
  isNewUser: boolean
}

export interface Memory {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string
}

interface MemoryCardProps {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string
}
function MemoryCard(memory: MemoryCardProps) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div>
      <div className=''>
        <Transition
          as='div'
          show={true}
          enter='transition-all duration-300 ease-in-out'
          enterFrom='transform scale-100'
          enterTo='transform scale-100'
          leave='transition-all duration-300 ease-in-out'
          leaveFrom='transform scale-100'
          leaveTo='transform scale-100'
          className='bg-white shadow rounded-lg p-4 mb-4 cursor-pointer flex h-[180px] overflow-hidden'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsDetailDialogOpen(true)}
        >
          <div
            className={clsx(
              'h-auto rounded-lg overflow-hidden transition-all duration-300 ease-in-out',
              isHovered ? 'w-[200px] max-w-[200px]' : 'w-[80px] max-w-[80px]'
            )}
          >
            <img
              src={'http://127.0.0.1:4001' + memory.imageUrl}
              alt='Memory'
              className='h-full w-full object-cover'
            />
          </div>
          <div className='ml-4 flex-1 transition-all duration-300 ease-in-out relative'>
            <h2 className='text-xl font-bold'>{memory.title}</h2>
            <p className='text-gray-500'>{memory.date}</p>
            <div className='inherit max-h-[150px] overflow-hidden'>
              <p className='mt-2 text-gray-700'>{memory.description}</p>
              <div className='absolute bottom-[-20px] left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent'></div>
            </div>
          </div>
        </Transition>
      </div>
      <MemoryDetailDialog
        memory={memory}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false)
        }}
      />
    </div>
  )
}

export default function Root() {
  const [cookies, , removeCookie] = useCookies(['username'])

  // Routes
  const location = useLocation()
  const navigate = useNavigate()

  const [memoriesList, setMemoriesList] = useState<Memory[] | undefined>(
    undefined
  )
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)
  const [maxNumPages, setMaxNumPages] = useState<number>(10)
  const [queryOrdering, setQueryOrdering] = useState<string>('asc')
  const [userName, setUserName] = useState<string>('')
  const [userDescription, setUserDescription] = useState<string>('')
  const [isUserDialogOpen, setIsUserDialogOpen] = useState<boolean>(false)
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>('')

  const getMemories = useCallback(
    (page: number) => {
      setIsLoadingPage(true)
      fetchMemories(page, 5, queryOrdering)
        .then(({ memories, page, totalPages }) => {
          const newMemories = memoriesList
            ? [...memoriesList, ...memories]
            : memories
          setMemoriesList(newMemories)
          setCurrentPage(page)
          setMaxNumPages(totalPages)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setIsLoadingPage(false)
        })
    },
    [queryOrdering, memoriesList]
  )

  const getNextPage = () => {
    if (!isLoadingPage && currentPage < maxNumPages) {
      getMemories(currentPage + 1)
    }
  }

  const logout = () => {
    removeCookie('username')
    navigate('/login')
  }

  // Handler functions

  const handleScroll = (e: any) => {
    const scrollHeight = e.target.documentElement.scrollHeight
    const currentHeight =
      e.target.documentElement.scrollTop + window.innerHeight
    if (
      currentHeight + 20 >= scrollHeight &&
      !isLoadingPage &&
      memoriesList &&
      currentPage < maxNumPages
    ) {
      getNextPage()
    }
  }

  const handleOnSelectFilter = (filter: string) => {
    const ordering = filter === 'Older to newer' ? 'desc' : 'asc'
    setQueryOrdering(ordering)
    setMemoriesList(undefined)
    setCurrentPage(1)
  }

  const handleMemorySubmit = () => {
    setCreateMemoryDialogIsOpen(false)
    setMemoriesList(undefined)
    setCurrentPage(1)
  }

  const handleUserSubmit = () => {
    const username = cookies.username as string | undefined
    console.log("SUBMITED", username)
    if (username === undefined) {
      //User not logged in
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

  // Hooks
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (memoriesList === undefined) {
      getMemories(1)
    }
  }, [queryOrdering, getMemories, memoriesList])

  useEffect(() => {
    const username = cookies.username as string | undefined

    if (!username) {
      //User not logged in
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
    const isNewUser = location.state?.isNewUser as NavigationState | undefined
    navigate(location.pathname, { replace: true });

    if (isNewUser) {
      setIsUserDialogOpen(true)
      return
    }
  }, [])

  const [createMemoryDialogIsOpen, setCreateMemoryDialogIsOpen] =
    useState(false)

  return (
    <div className='min-h-screen'>
      <div className='max-w-3xl mx-auto p-4 h-screen'>
        <Button
          className='border-none btn-primary absolute right-0 top-0 m-4  '
          onClick={logout}
        >
          {' '}
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
            <Button
              className='btn-primary mt-4 mr-2 text-gray-600'
              onClick={() => setIsUserDialogOpen(true)}
            >
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
        <div className='flex justify-between items-center mb-4'>
          <Button
            className='btn-primary'
            onClick={() => setCreateMemoryDialogIsOpen(true)}
          >
            + New memory
          </Button>
          <DropdownMenu
            options={['Older to newer', 'Newer to older']}
            onSelect={handleOnSelectFilter}
          />
        </div>
        <div>
          {memoriesList?.map((memory) => (
            <MemoryCard
              key={memory.id}
              id={memory.id}
              title={memory.title}
              date={memory.date}
              description={memory.description}
              imageUrl={memory.imageUrl}
            />
          ))}
        </div>
        {isLoadingPage && (
          <div className='text-center py-4 text-gray-700'>
            Loading more memories...
          </div>
        )}
        {currentPage != 1 && currentPage >= maxNumPages && !isLoadingPage && (
          <div className='text-center py-4 text-gray-700'>
            No more memories to load
          </div>
        )}
      </div>
      {maxNumPages != 1 && (
        <span className='absolute bottom-[-20px] pt-4'>{'\u00A0'}</span>
      )}
      <CustomDialog
        isOpen={createMemoryDialogIsOpen}
        title={'Log your memory'}
        onClose={() => setCreateMemoryDialogIsOpen(false)}
      >
        <MemoryForm onSubmit={handleMemorySubmit} />
      </CustomDialog>
      <CustomDialog
        isOpen={isUserDialogOpen}
        title={'Profile'}
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
