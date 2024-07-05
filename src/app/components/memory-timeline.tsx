import { Button } from '@headlessui/react'
import { useState, useEffect, useCallback } from 'react'
import CustomDialog from '../components/custom-dialog'
import { MemoryCard } from '../components/memory-card'
import DropdownMenu from './../components/dropdown-menu'
import MemoryForm from '../forms/memory-form'
import { fetchMemories } from '../lib/api-client'
import { Memory } from '../../types'

interface MemoryTimelineProps {
username: string | undefined
  showCreateButton: boolean
}

const MemoryTimeline = ({ username,  showCreateButton }: MemoryTimelineProps) => {
  const [memoriesList, setMemoriesList] = useState<Memory[] | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true)
  const [maxNumPages, setMaxNumPages] = useState<number>(10)
  const [queryOrdering, setQueryOrdering] = useState<string>('asc')
  const [createMemoryDialogIsOpen, setCreateMemoryDialogIsOpen] = useState<boolean>(false)

  const getMemories = useCallback((page: number) => {
    setIsLoadingPage(true)
    fetchMemories(page, 5, queryOrdering, username)
      .then(({ memories, page, totalPages }) => {
        const newMemories = memoriesList ? [...memoriesList, ...memories] : memories
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
  }, [queryOrdering, memoriesList])

  const handleScroll = (e: any) => {
    const scrollHeight = e.target.documentElement.scrollHeight
    const currentHeight = e.target.documentElement.scrollTop + window.innerHeight
    if (currentHeight + 20 >= scrollHeight && !isLoadingPage && memoriesList && currentPage < maxNumPages) {
      getMemories(currentPage + 1)
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

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        {showCreateButton && (
          <Button className='btn-primary' onClick={() => setCreateMemoryDialogIsOpen(true)}>
            + New memory
          </Button>
        )}
        <DropdownMenu options={['Older to newer', 'Newer to older']} onSelect={handleOnSelectFilter} />
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
      {currentPage !== 1 && currentPage >= maxNumPages && !isLoadingPage && (
        <div className='text-center py-4 text-gray-700'>
          No more memories to load
        </div>
      )}
      <CustomDialog
        isOpen={createMemoryDialogIsOpen}
        title={'Log your memory'}
        onClose={() => setCreateMemoryDialogIsOpen(false)}
      >
        <MemoryForm onSubmit={handleMemorySubmit} />
      </CustomDialog>

    </div>
  )
}

export default MemoryTimeline
