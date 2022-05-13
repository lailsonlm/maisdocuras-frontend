import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { RiShoppingBasketFill } from 'react-icons/ri'
import { CartContext } from '../../context/CartContext'

export function ShoppingCartIcon() {
  const { cart } = useContext(CartContext)
  const [amountProducts, setAmountProducts] = useState<number>(0)
  useEffect(() => {
    const amount = cart.reduce((amountTotal, product) => {
      return amountTotal + product.amount
    }, 0)

    setAmountProducts(amount)
  }, [cart])

  return (
    <Link href='/cart'>
      <a className="p-2 group relative hover:brightness-110 transition-all duration-500 ">
        <div className="bg-brown-400 text-pink-50 font-semibold sm:text-sm text-xs py-0.5 p-1 sm:py-0.5 sm:px-1.5 rounded-full absolute bottom-0 right-0 ">
          {amountProducts}
        </div>
        <RiShoppingBasketFill className='fill-pink-50 w-6 h-6 sm:w-8 sm:h-8'/>
      </a>
    </Link>
  )
}