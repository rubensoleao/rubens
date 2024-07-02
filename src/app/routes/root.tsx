import { CubeIcon, ChevronDownIcon, ShareIcon } from '@heroicons/react/20/solid'
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
  Button,
} from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import  DropdownMenu  from './../components/dropdown-menu'
interface Memory {
  id: number
  title: string
  date: string
  description: string
  img: string
}

interface MemoryCardProps {
  title: string
  date: string
  description: string
  img: string
}

function MemoryCard({ title, date, description, img }: MemoryCardProps) {
  return (
    <div className='bg-white shadow rounded-lg p-4  mb-4  '>
      <div className='flex items-center'>
        <img src={img} alt='Cactus' className='h-20 w-20 rounded-full' />
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
  const [db, setDB] = useState<{ memories: Memory[] }>({
    //FIXME: DBMOCK This is just for development remove and interface with real DB
    memories: [
      {
        id: 1,
        title: 'Hello world',
        date: 'May 30, 1999',
        description: 'I was born on a sunny day on planet earth',
        img: 'https://picsum.photos/seed/123/400',
      },
      {
        id: 2,
        title: 'Hello world',
        date: 'May 30, 1999',
        description: 'I was born on a sunny day on planet earth',
        img: 'https://picsum.photos/seed/1234/400',
      },
      {
        id: 3,
        title: 'Hello world',
        date: 'May 30, 1999',
        description: 'I was born on a sunny day on planet earth',
        img: 'https://picsum.photos/seed/1235/400',
      },
    ],
  })

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false)
  const [maxNumPages, setMaxNumPages] = useState<number>(10)

  const getNextPage = () => {
    if (isLoadingPage || currentPage >= maxNumPages) {
      return
    }
    setIsLoadingPage(true)
    setTimeout(() => {
      //FIXME: DBMOCK
      const newDB = { ...db }
      newDB.memories.push(...newDB.memories.slice(0, 3))
      setDB(newDB)
      setCurrentPage(currentPage + 1)
      setIsLoadingPage(false)
    }, 1000)
  }

  const handleScroll = (e: any) => {
    console.log(document.body.offsetHeight)
    const scrollHeight = e.target.documentElement.scrollHeight
    const currentHeight =
      e.target.documentElement.scrollTop + window.innerHeight
    if (
      currentHeight + 20 >= scrollHeight &&
      !isLoadingPage &&
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
  }, [isLoadingPage, currentPage])

  return (
    <div className=' min-h-screen'>
      <div className='max-w-3xl mx-auto p-4 h-screen'>
        <div className='flex items-center justify-center lg:fixed lg:top-4 lg:left-4 md:sticky md:top-0 md:z-10 '>
          <CubeIcon className='h-6 w-6 text-blue-500' />
          <p className='text-lg font-semibold text-gray-900 ml-2'>
            Memory Lane
          </p>
        </div>
        <div className='flex items-center justify-between pt-2 mb-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Jae's memory lane
          </h1>
          <Button className='btn-primary'>
            <ShareIcon className='w-4 h-4 text-blue-600' />
          </Button>
        </div>
        <div>
          <p className='text-gray-700 mb-8'>
            Jae Doe's journey has been a tapestry of curiosity and exploration.
            From a young age, their inquisitive mind led them through diverse
            interests. Education shaped their multidisciplinary perspective,
            while personal experiences added depth and resilience to their
            story. Embracing challenges and cherishing relationships, Jae
            continues to craft a unique and inspiring life history.
          </p>
        </div>
        <div className='flex justify-between items-center mb-4'>
          <Button className='inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
            + New memory
          </Button>
          <DropdownMenu options={['Older to new', 'New to older']} />
        </div>
        <div>
          {db.memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              title={memory.title}
              date={memory.date}
              description={memory.description}
              img={memory.img}
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
      {
        // Add a nbsp to bottom of page to enable scrooling mechanism
        // maybye put this in seperate component to make it more readable
        maxNumPages != 1 && (
          <span className='absolute bottom-[-20px] pt-4 '>{'\u00A0'}</span>
        )
      }
    </div>
  )
}
