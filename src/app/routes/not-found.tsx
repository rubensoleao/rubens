import { CubeIcon } from '@heroicons/react/20/solid'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <CubeIcon className="h-24 w-24 text-black-500" />
          <h1 className="text-6xl font-bold text-gray-900 ml-4">Memory Lane</h1>
        </div>
        <h2 className="text-4xl font-semibold text-gray-700 mb-4">404</h2>
        <p className="text-xl text-gray-600">Page Not Found</p>
      </div>
    </div>
  )
}
