import { useNavigate, useParams } from 'react-router-dom'
import MemoryTimeline from '../components/memory-timeline'
import { fetchUser } from '../lib/api-client'
import { useEffect, useState } from 'react'
import { User } from '../../types'

const ShareMemoryScreen = () => {
  const { username } = useParams()
  const [user, setUser] = useState<User | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    if (!username) {
      //TODO: treat error userside
      navigate('/not-found')
      return
    }
    fetchUser(username)
      .then((user) => {
        setUser(user)
      })
      .catch((err) => {
        console.error(err)
        navigate('/not-found')
      })
  }, [])

  return (
    user && (
      <div>
        <h1 className='text-2xl font-semibold text-gray-900'>
          {user.name ? `${user.name}'s Memory Lane` : 'Memory Lane'}
        </h1>
        <p className='text-gray-700 mb-8'>
          {user?.description || 'User description goes here.'}
        </p>
        {/* Your component code here */}
        <MemoryTimeline username={username} isEditable={false} />
      </div>
    )
  )
}

export default ShareMemoryScreen
