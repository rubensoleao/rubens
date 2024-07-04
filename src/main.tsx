import ReactDOM from 'react-dom/client'
import Root from './app/routes/root.tsx'
import LoginScreen from './app/routes/login.tsx'
import { CookiesProvider } from 'react-cookie'

import './main.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NotFound from './app/routes/not-found.tsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/',
    element: <Root />,
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
