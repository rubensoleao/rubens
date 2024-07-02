import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './app/routes/root.tsx'
import './main.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import NotFound from './app/routes/not-found.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "*",
    element: <NotFound />
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
