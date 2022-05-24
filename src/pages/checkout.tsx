import { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { AiOutlineWhatsApp } from "react-icons/ai"
import nookies from 'nookies'
import { MdArrowBackIosNew, MdExpandLess, MdExpandMore } from "react-icons/md"
import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { AuthContext } from "../context/AuthContext"
import { CartContext, ProductCart } from "../context/CartContext"
import { api } from "../services/api"
import { formatPrice } from "../util/format"
import { FormPayment } from "../components/Checkout/FormPayment"
import { CardPrimaryAdress } from "../components/Checkout/CardPrimaryAdress"
import { CardSecondaryAdress } from "../components/Checkout/CardSecondaryAddress"
import { string } from "yup"

interface CartProps {
  shipping: {
    attributes: {
      district: string;
      city: string;
      price: number;
    }
  }[]
}

export type TypePayment = {
  formPayment: string;
  moneyChange: string;
}

export default function Checkout({ shipping }: CartProps) {
  const router = useRouter()
  const { cart, setCart } = useContext(CartContext)
  const { isAuthenticated, userData, phoneNumber } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState<ProductCart[]>([])
  const [isExpandedAdress, setIsExpandedAdress] = useState(false)
  const [isPrimaryAdress, setIsPrimaryAdress] = useState(true)
  const [typePayment, setTypePayment] = useState({} as TypePayment)

  const total =
    formatPrice(
      cartItems.reduce((sumTotal, product) => {
        return sumTotal + product.attributes.price * product.amount
      }, 0)
    )

  useEffect(() => {
    setCartItems(cart)
  }, [cart])

  const shippingData = shipping.find((data) => {
    if(isPrimaryAdress) {
      if(data.attributes.district === userData?.district && data.attributes.city === userData?.city) {
        return data
      }
    } else {
      if(data.attributes.district === userData?.secondaryAdress.district && data.attributes.city === userData?.secondaryAdress.city) {
        return data
      }
    }
  })

  const shippingPrice = shippingData ? formatPrice(shippingData.attributes.price)  : ''

  const sumTotalProducts =
  cartItems.reduce((sumTotal, product) => {
    return (sumTotal + product.attributes.price * product.amount)
  }, 0)

  const totalPayable = formatPrice(sumTotalProducts + (shippingData ? shippingData.attributes.price : 0)) 
  
  function sendOrder() {
    const number = '5581999721377'
    
    const products = cartItems.map((item) => `
  *PRODUTO*: ${item.attributes.title}
  *QTD*: ${item.amount}
  *PREÇO*: ${formatPrice(item.attributes.price * item.amount)}
  `  
    )
  
    const customerData = `*MAIS DOÇURAS - DELIVERY*
  
  *CLIENTE*: ${userData?.name}
  *ENDEREÇO*: ${isPrimaryAdress ? userData?.street : userData?.secondaryAdress.street}, ${isPrimaryAdress ? userData?.houseNumber : userData?.secondaryAdress.houseNumber}
  *BAIRRO*: ${isPrimaryAdress ? userData?.district : userData?.secondaryAdress.district}
  *CIDADE*: ${isPrimaryAdress ? userData?.city : userData?.secondaryAdress.city}
  *COMPLEMENTO*: ${isPrimaryAdress ? userData?.complement : userData?.secondaryAdress.complement}
  *PONTO DE REF.:*: ${isPrimaryAdress ? userData?.referencePoint : userData?.secondaryAdress.referencePoint}
  *CONTATO*: ${phoneNumber}`
    
    const message = `${customerData}\n${products}\n\n*TOTAL PEDIDO*: ${total}\n*+ FRETE*: ${shippingPrice}\n\n*TOTAL A PAGAR*: ${totalPayable}\n*FORMA DE PAGAMENTO*: ${typePayment.formPayment}\n${typePayment.formPayment === 'Dinheiro' ? `*TROCO PARA*: ${formatPrice(parseInt(typePayment.moneyChange))}` : ''}`
  
    if(isAuthenticated) {
      const target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(number)}&text=${encodeURIComponent(message)}`
      window.open(target, 'black')

      window.localStorage.setItem('mais-docuras:cart', JSON.stringify([]))
      setCart([])
      router.push('/aftersales')
    } else {
      router.push('/signin')
    }
  }

  return (
    <>
      <Head>
        <title>Mais Doçuras | Finalizar Compra</title>
      </Head>
      <div className="min-h-[calc(100vh-6rem)] h-full w-full bg-pink-300">
        <Header />
        <div className="items-center m-auto max-w-screen-xl p-6 sm:px-8">
          <h2 className="font-semibold text-xl">Finalizar compra</h2>
          <Link href="/">
            <a className="flex items-center text-brown-400 font-semibold hover:brightness-110 transition-all duration-500">
              <MdArrowBackIosNew />
              <span className="ml-1 text-md">Continuar comprando</span>
            </a>
          </Link>
        </div>

        <div className="max-w-screen-xl items-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-auto h-full p-6 sm:p-8">
          {isExpandedAdress ? 
          <div className="flex lg:col-span-2 flex-col gap-4">
            <div className="flex flex-col items-center justify-between p-4 sm:p-8 h-full bg-pink-50 sm:mb-0 shadow-md rounded-lg">
              <button type="button" className="w-full mb-2 sm:mb-4" onClick={() => setIsExpandedAdress(false)}>
                <div className="flex items-center text-lg font-semibold sm:text-2xl text-gray-700 justify-center">
                  <h3 className="mr-2 text-lg sm:text-2xl text-center font-semibold text-gray-700">Endereço de entrega</h3>
                  <MdExpandLess/>
                </div>
              </button>

              <div className="w-full items-center grid grid-cols-1 md:grid-cols-2 gap-4 m-auto h-full">
                {isPrimaryAdress ? 
                  <button
                    onClick={() => setIsPrimaryAdress(true)}
                    className="w-full flex flex-col items-center justify-center gap-4 h-full bg-blue-200 shadow-md rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">Endereço Principal</h3>
                    <CardPrimaryAdress />
                  </button>
                :
                  <button
                    onClick={() => setIsPrimaryAdress(true)}
                    className="w-full flex flex-col items-center justify-center gap-4 h-full border-2 border-gray-200 shadow-md rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">Endereço Principal</h3>
                    <CardPrimaryAdress />
                  </button>
                }
              
              {!isPrimaryAdress ? 
                  <button 
                    onClick={() => setIsPrimaryAdress(false)}
                    className="w-full flex flex-col items-center justify-center gap-4 h-full bg-blue-200 shadow-md rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">Endereço Secundário</h3>
                    <CardSecondaryAdress />
                  </button>
                :
                  <button 
                    disabled={!userData?.secondaryAdress && true}
                    onClick={() => setIsPrimaryAdress(false)}
                    className="w-full flex flex-col items-center justify-center gap-4 h-full border-2 border-gray-200 shadow-md rounded-lg p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-700">Endereço Secundário</h3>
                    <CardSecondaryAdress />
                  </button>
                }
              </div>
              
            </div>

            <FormPayment setTypePayment={setTypePayment}/>
          </div>
          :
            <div className="flex lg:col-span-2 flex-col gap-4">
              <button type="button" onClick={() => setIsExpandedAdress(true)}>
                <div className="flex items-center text-lg font-semibold sm:text-2xl text-gray-700 justify-center p-2 bg-pink-50 shadow-md rounded-lg">
                  <h3 className="text-center mr-2">Endereço de entrega</h3>
                  <MdExpandMore className="text-xl sm:text-3xl"/>
                </div>
              </button>

              <FormPayment setTypePayment={setTypePayment}/>
            </div>
          }

          <div className="flex items-start justify-between p-4 sm:p-8 bg-pink-50 shadow-md rounded-lg">
            <div className="w-full">
              <h3 className="sm:mb-2 text-lg sm:text-2xl text-center font-semibold text-gray-700">Resumo do Pedido</h3>
              {cartItems.map((product) => {
                return (
                <div key={product.id} className="grid grid-cols-3 gap-2 w-full h-full mt-8">
                  <p>{product.attributes.title}</p>
                  <p className="flex items-center justify-center">{product.amount}x</p>
                  <p className="flex items-center justify-end">{formatPrice(product.attributes.price * product.amount)}</p>
                </div>
                )
              })}
              <div className="flex items-center justify-between font-semibold sm:text-lg mt-8">
                <p>Frete:</p>
                <p>{shippingPrice}</p>
              </div>
              <div className="flex items-center justify-between font-semibold sm:text-lg">
                <p>Total a pagar:</p>
                <p>{totalPayable}</p>
              </div>
                <button 
                  onClick={() => sendOrder()}
                  className="flex mt-6 w-full p-2 bg-blue-200 rounded-md text-gray-700 font-bold items-center justify-center hover:brightness-110 transition-all duration-500 gap-2">
                  <span className="ml-2">Enviar Pedido</span>
                  <AiOutlineWhatsApp className='w-6 h-6'/> 
                </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const token = cookies['maisdocuras.token']

  if(!token) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }

  const response = await api.get(`shippings`)
  const shipping = response.data.data
 
  return {
    props: {
      shipping,
    }
  }
}