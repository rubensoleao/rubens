import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom/client'
import LoginScreen from './app/routes/login.tsx'
import Root from './app/routes/root.tsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './app/routes/not-found.tsx'
import ShareMemoryScreen from './app/routes/share-memories.tsx'
import './main.css'
import MemoryTimelineLayout from './app/layouts/memory-timeline.tsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/',
    element: <MemoryTimelineLayout />,
    children: [
      {
        index: true,
        element: <Root />,
      },
      {
        path: 'share/:username',
        element: <ShareMemoryScreen />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <RouterProvider router={router} />
  </CookiesProvider>
)
