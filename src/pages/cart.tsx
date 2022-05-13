import Head from "next/head"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { MdArrowBackIosNew } from "react-icons/md"
import { IoBagCheckOutline } from "react-icons/io5"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { CartContext, ProductCart } from "../context/CartContext"
import { CardCart } from "../components/CardCart"
import { formatPrice } from "../util/format"
import { AuthContext } from "../context/AuthContext"
import { useRouter } from "next/router"

export default function Cart() {
  const router = useRouter()
  const { cart } = useContext(CartContext)
  const { isAuthenticated } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState<ProductCart[]>([])

  const total =
    formatPrice(
      cartItems.reduce((sumTotal, product) => {
        return sumTotal + product.attributes.price * product.amount
      }, 0)
    )

  useEffect(() => {
    setCartItems(cart)
  }, [cart])

  function sendRequest() {

    const number = '5581999721377'
    
    const products = cartItems.map((item) => `
*PRODUTO*: ${item.attributes.title}\n*QTD*: ${item.amount}\n*PREÇO*: ${formatPrice(item.attributes.price * item.amount)}
`  
    )

    const customerData = `*PEDIDO*
*CLIENTE*: Lailson Sobral
*ENDEREÇO*: Rua Antonio Alves de Oliveira, 29
*BAIRRO*: Paratibe
*CIDADE*: Paulista
*CONTATO*: (81) 97913-2765`

    const message = `${customerData}\n${products}\n\n*TOTAL A PAGAR*: ${total}`

    if(isAuthenticated) {
      const target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(number)}&text=${encodeURIComponent(message)}`
      window.open(target, 'black')
    } else {
      router.push('/signin')
    }
  }

  return (
    <>
      <Head>
        <title>Mais Doçuras | Minha Cestinha</title>
      </Head>
      <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
        <Header />
        <div className="items-center m-auto max-w-screen-xl p-6 sm:px-8">
          <h2 className="font-semibold text-xl">Minha cestinha</h2>
          <Link href="/">
            <a className="flex items-center text-brown-400 font-semibold hover:brightness-110 transition-all duration-500">
              <MdArrowBackIosNew />
              <span className="ml-1 text-md">Continuar comprando</span>
            </a>
          </Link>
        </div>
        {cartItems.length ? 
          <div className="max-w-screen-xl m-auto sm:h-full group p-6 sm:p-8">
            {cartItems.map((product) => {
              return (
                <CardCart key={product.id} product={product} />
              )
            })}
          <div className="flex w-full justify-end items-center py-8">
            <div className="w-full sm:w-1/3">
                <div className="flex items-center justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>{total}</p>
                </div>
                <button 
                  onClick={sendRequest}
                  className="flex mt-6 w-full p-2 bg-blue-200 rounded-md text-gray-700 font-bold items-center justify-center hover:brightness-110 transition-all duration-500 gap-2">
                  <span className="ml-2">Finalizar compra</span>
                  <IoBagCheckOutline className='w-6 h-6'/> 
                </button>
              </div>
            </div>
          </div>
        :
          <div className="flex max-w-screen-xl m-auto sm:h-full items-center justify-center p-6 sm:p-8">
            <h2 className="font-semibold text-xl">Sua cestinha está vazia :(</h2>
          </div>
        }
      </div>
      <Footer />
    </>
  )
}