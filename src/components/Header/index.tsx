import Link from "next/link";
import { useContext } from "react";
import { FaUserCircle } from 'react-icons/fa'
import { AuthContext } from "../../context/AuthContext";
import { ShoppingCartIcon } from "../ShoppingCartIcon";

export function Header() {
  const { userData } = useContext(AuthContext)
  return (
    <div className="flex items-center justify-between h-24 sm:h-32 bg-pink-400 px-4 sm:px-10 ">
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Logo Mais Doçuras" className="w-16 h-16 sm:w-24 sm:h-24" />
        </a>
      </Link>
      <div className="flex">
      {userData && 
      <div className="max-w-2xl mx-auto pt-2 px-4 sm:px-6 lg:max-w-7xl">
        <h2 className="font-semibold text-brown-400">{userData.name}!</h2>
      </div>
      }
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