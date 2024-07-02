import { Menu, Transition, MenuButton, MenuItems, MenuItem, } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment, useState } from 'react'

interface DropdownMenuProps {
  options: string[]
  onSelect?: (option: string) => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, onSelect=()=>{} }) => {
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleSelect = (option: string) => {
    setSelectedOption(option)
    onSelect(option)
  }

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton className='inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'>
        {selectedOption || 'Sort'}
        <ChevronDownIcon className='h-4 w-4 size-4 fill-black/60' />
      </MenuButton>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <MenuItems
          className='origin-top-left absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
          anchor='bottom end'
        >
          <div className='py-1'>
            {options.map((option, index) => (
              <MenuItem key={index}>
                {({ active }) => (
                  <a
                    href='#'
                    onClick={() => handleSelect(option)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm`}
                  >
                    {option}
                  </a>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}

export default DropdownMenu
