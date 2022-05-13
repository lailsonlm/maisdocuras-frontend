import { useContext } from "react";
import { FiMinus, FiPlus } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { CartContext, ProductCart } from "../../context/CartContext"
import { formatPrice } from "../../util/format"

interface CardCartProps {
  product: ProductCart;
}

type ProductUpdate = {
  id: number;
  amount: number;
  attributes: {
    title: string;
    slug: string;
    price: number;
    stock: number;
    description: string;
    cover: {
      data: {
        attributes: {
          alternativeText: string;
          url: string,
        }
      }
    },
    typesTaste: {
      id: number;
      types: string;
    }[]
  }
}


export function CardCart({ product }: CardCartProps) {
  const { removeProduct, updateProductAmount } = useContext(CartContext)

  function handleProductIncrement(product: ProductUpdate) {
    updateProductAmount({ amount: product.amount + 1, id: product.id, attributes: product.attributes })
  }

  function handleProductDecrement(product: ProductUpdate) {
    updateProductAmount({ amount: product.amount - 1, id: product.id, attributes: product.attributes })
  }

  const cartFormatted = {
    ...product,
    priceFormatted: formatPrice(product.attributes.price),
    subTotal: formatPrice(product.attributes.price * product.amount)
  }
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row items-center justify-between p-8 h-full min-h-36 bg-pink-50 mb-6 box-content shadow-md rounded-lg">
      <div className="flex sm:w-3/4 w-full h-full item-center overflow-hidden">
        <div className="flex sm:w-36 w-24 h-24 sm:h-full sm:max-h-36 item-center justify-center rounded-lg overflow-hidden">
          <img
            src={product.attributes.cover.data.attributes.url}
            alt={product.attributes.cover.data.attributes.alternativeText}
            className="w-full h-full object-center object-cover"
          />
        </div>

        <div className="flex flex-col ml-4 flex-1 justify-center sm:justify-start ">
          <h3 className="sm:mb-2 text-lg sm:text-2xl font-semibold text-gray-700">{product.attributes.title}</h3>
          <p className="text-xs text-gray-700 text-justify sr-only sm:not-sr-only ">{product.attributes.description}</p>
        </div>
      </div>

      <div className="flex sm:w-1/2 w-full flex-col h-full sm:h-36 sm:ml-4 justify-between sm:items-end">
        <button 
          className="flex justify-end"
          onClick={() => removeProduct(product)}
        >
          <RiDeleteBin6Line />
        </button>
        <div className="w-full flex items-center justify-between sm:justify-end mt-4">
          <div className="min-w-20 flex items-center justify-between p-2 mr-12 border-gray-300 border rounded-lg ">
            <button 
              onClick={() => handleProductDecrement(product)}
              className="text-brown-400 font-bold"
              >
              <FiMinus />
            </button>
            <p className="px-4">{product.amount}</p>
            <button 
              onClick={() => handleProductIncrement(product)}
              className="text-brown-400 font-bold"
            >
              <FiPlus />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-brown-400">{cartFormatted.subTotal}</p>
        </div>
      </div>
    </div>           
  )
}