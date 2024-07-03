import { Button } from '@headlessui/react'

import { CubeIcon, PencilIcon, ShareIcon } from '@heroicons/react/20/solid'
import { useCallback, useEffect, useState } from 'react'
import CustomDialog from '../components/custom-dialog'
import MemoryForm from '../forms/memory-form'
import UserEditForm from '../forms/user-edit-form'
import { fetchMemories, fetchUser } from '../lib/api-client'
import DropdownMenu from './../components/dropdown-menu'

export interface Memory {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string
}

interface MemoryCardProps {
  title: string
  date: string
  description: string
  imageUrl: string
}

function MemoryCard({ title, date, description, imageUrl }: MemoryCardProps) {
  return (
    <div className='bg-white shadow rounded-lg p-4 mb-4'>
      <div className='flex'>
        <div className='h-[150px] w-[150px] rounded-lg overflow-hidden'>
          <img
            src={'http://127.0.0.1:4001' + imageUrl}
            alt='Memory'
            className='h-full w-full object-cover'
          />
        </div>
        <div className='ml-4'>
          <h2 className='text-xl font-bold'>{title}</h2>
          <p className='text-gray-500'>{date}</p>
          <p className='mt-2 text-gray-700'>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Root() {
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
    fetchUser()
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
        setIsUserDialogOpen(true)
      })
  }, [])

  // Create Memory Dialog
  const [createMemoryDialogIsOpen, setCreateMemoryDialogIsOpen] =
    useState(false)

  const selectFilter = (filter: string) => {
    const ordering = filter === 'Older to newer' ? 'desc' : 'asc'
    setQueryOrdering(ordering)
    setMemoriesList(undefined)
    setCurrentPage(1)
  }

  const handleMemorySubmit = () => {
    setCreateMemoryDialogIsOpen(false)
    setMemoriesList(undefined)
    getMemories(1)
  }

  const handleUserSubmit = () => {
    setIsUserDialogOpen(false)
    fetchUser()
      .then((user) => {
        setUserName(user.name)
        setUserDescription(user.description)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-3xl mx-auto p-4 h-screen'>
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
              className='btn-primary mt-4 mr-2'
              onClick={() => setIsUserDialogOpen(true)}
            >
              <PencilIcon className='w-4 h-4' />
            </Button>
            <Button className='btn-primary'>
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
            onSelect={selectFilter}
          />
        </div>
        <div>
          {memoriesList?.map((memory) => (
            <MemoryCard
              key={memory.id}
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
        title={'Profile' }
        onClose={() => {
          setIsUserDialogOpen(false)
        }}
      >
        <UserEditForm onSubmit={handleUserSubmit} />
      </CustomDialog>
    </div>
  )
}
