import Link from "next/link";
import { FaUserCircle } from 'react-icons/fa'
import { ShoppingCartIcon } from "../ShoppingCartIcon";

export function Header() {
  return (
    <div className="flex items-center justify-between h-24 sm:h-32 bg-pink-400 px-4 sm:px-10 ">
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Logo Mais Doçuras" className="w-16 h-16 sm:w-24 sm:h-24" />
        </a>
      </Link>
      <div className="flex">
        <Link href='/profile'>
          <a className="py-2 px-1 sm:p-2 hover:brightness-110 transition-all duration-500">
            <FaUserCircle className='fill-pink-50 w-6 h-6 sm:w-8 sm:h-8'/>
          </a>
        </Link>
        <ShoppingCartIcon />
      </div>
    </div>
  )
}