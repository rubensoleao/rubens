import { useNavigate, useParams } from 'react-router-dom';
import MemoryTimeline from '../components/memory-timeline';
import { fetchUser } from '../lib/api-client';
import { useEffect, useState } from 'react';
import { User } from '../../types';

const ShareMemoryScreen = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(()=>{
    if (!username){
      //TODO: treat error userside
      navigate('/not-found')
      return
    }
    fetchUser(username).then((user)=>{
      setUser(user)
    }).catch((err)=>{
      console.error(err)
      navigate('/not-found')
    })
  },[])

  
  return (
    <div>
      <h1>Memory Lane for {username}</h1>
      {/* Your component code here */}
      <MemoryTimeline
          username={username}
          isEditable={false}
        />
    </div>
  );
};

export default ShareMemoryScreen;
