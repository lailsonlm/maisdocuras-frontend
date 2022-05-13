import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";
import { toast } from "react-toastify";

type CartContextData = {
  cart: ProductCart[];
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (product: Product) => void;
  updateProductAmount: (product: ProductCart) => void;
}

type CartProviderProps = {
  children: ReactNode;
}

interface UpdateProductAmount {
  id: number;
  amount: number;
  attributes: {
    stock: number;
  }
}

interface Product {
  id: number;
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
    }
  }
}

export interface ProductCart extends Product {
  amount: number;
}

export const CartContext = createContext({} as CartContextData)

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<ProductCart[]>(() => {
    if (typeof window !== 'undefined') {
      const storagedCart = window.localStorage.getItem('mais-docuras:cart');

      if (storagedCart) {
         return JSON.parse(storagedCart);
       }
       return [];
  }
  });

  const router = useRouter()

  const notifySucess = () => toast('Produto adicionado à cestinha', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    progressStyle: {
      background:"#90C5D7"
    },
    style: {
      background: "#FDF6F8",
      color: "#374151"
    }
    });
  
  const addProduct = async (product: Product) => {
    try {
      const updatedCart = [...cart]
      const productExists = updatedCart.find(productEx => productEx.id === product.id)
    
      const stockAmount = product.attributes.stock;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1

      if(amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque', {
          position: "bottom-center",
          autoClose: 5000,
        });

        return;
      }

      if(productExists) {
        productExists.amount = amount
      } else {
        const newProduct = {
          ...product,
          amount: 1
        }

        updatedCart.push(newProduct)
      }

      setCart(updatedCart)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('mais-docuras:cart', JSON.stringify(updatedCart))
      }
      notifySucess()
      router.push('/cart')

    } catch {
      toast.error('Erro na adição do produto', {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };


  const removeProduct = (product: Product) => {
    try {
      const updatedCart = [...cart]
      const productExists = updatedCart.findIndex(productEx => productEx.id === product.id)

      if(productExists >= 0) {
        updatedCart.splice(productExists, 1)    
        
        setCart(updatedCart)
        localStorage.setItem('mais-docuras:cart', JSON.stringify(updatedCart))
      } else {
        throw Error();
      }

    } catch {
      toast.error('Erro na remoção do produto', {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };

  const updateProductAmount = async ({
    id,
    amount,
    attributes
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0) {
        return
      }

      const stockAmount = attributes.stock;

      if(amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque', {
          position: "bottom-center",
          autoClose: 5000,
        });

        return
      }

      const updatedCart = [...cart]
      const productExists = updatedCart.find(productEx => productEx.id === id)

      if(productExists) {
        productExists.amount = amount

        setCart(updatedCart)
        localStorage.setItem('mais-docuras:cart', JSON.stringify(updatedCart))
      } else {
        throw Error();
      }


    } catch {
      toast.error('Erro na alteração de quantidade do produto', {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
  };


  return (
    <CartContext.Provider value={{ cart, addProduct, removeProduct, updateProductAmount }}>
      {children}
    </CartContext.Provider>
  )
}