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
import { api } from "../services/api"
import { GetStaticProps } from "next"

interface CartProps {
  shipping: {
    attributes: {
      district: string;
      city: string;
      price: number;
    }
  }[]
}

export default function Cart({ shipping }: CartProps) {
  const router = useRouter()
  const { cart } = useContext(CartContext)
  const { isAuthenticated, userData, phoneNumber } = useContext(AuthContext)
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

    const customerData = `*MAIS DOÇURAS - DELIVERY*

*CLIENTE*: ${userData?.name}
*ENDEREÇO*: ${userData?.street}, ${userData?.houseNumber}
*BAIRRO*: ${userData?.district}
*CIDADE*: ${userData?.city}
*COMPLEMENTO*: ${userData?.complement}
*PONTO DE REF.:*: ${userData?.referencePoint}
*CONTATO*: ${phoneNumber}`

    const shippingData = shipping.find((data) => {
      if(data.attributes.district === userData?.district && data.attributes.city === userData?.city) {
        return data
      }
    })

    const shippingPrice = shippingData ? formatPrice(shippingData.attributes.price)  : ''

    const sumTotalProducts =
      cartItems.reduce((sumTotal, product) => {
        return (sumTotal + product.attributes.price * product.amount)
      }, 0)

    const totalPayable = formatPrice(sumTotalProducts + (shippingData ? shippingData.attributes.price : 0)) 

    const message = `${customerData}\n${products}\n\n*TOTAL PEDIDO*: ${total}\n\n*+ FRETE*: ${shippingPrice}\n*TOTAL A PAGAR*: ${totalPayable}`

    if(isAuthenticated) {
      const target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(number)}&text=${encodeURIComponent(message)}`
      window.open(target, 'black')
    } else {
      router.push('/signin')
    }
  }

  function registerProfile() {
    router.push('/profile')
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
                  onClick={userData ? sendRequest : registerProfile}
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

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await api.get(`shippings`)
  const shipping = response.data.data
 
  return {
    props: {
      shipping,
    },
    revalidate: 10, // In seconds
  }
}