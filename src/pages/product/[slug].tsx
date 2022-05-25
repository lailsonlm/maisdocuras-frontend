import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import qs from "qs";
import { useContext } from "react";
import { RiShoppingBasketFill } from "react-icons/ri";
import { MdArrowBackIosNew } from "react-icons/md";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { CartContext } from "../../context/CartContext";
import { api } from "../../services/api";
import Link from "next/link";
import { formatPrice } from "../../util/format";

interface ProductProps {
  product: {
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
}

export default function Product({ product }: ProductProps) {
  const router = useRouter()
  const { addProduct } = useContext(CartContext)

  if (router.isFallback) {
    return <div>Loading...</div>
  }


  function addToCart() {
    addProduct(product)
  }

  const priceFormatted = formatPrice(product.attributes.price)

  return (
    <>
      <Head>
        <title>Mais Doçuras | {product.attributes.title}</title>
      </Head>
      <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
        <Header />
        <div className="flex m-auto max-w-screen-xl p-2 sm:py-6">
          <Link href="/">
            <a className="flex items-center text-brown-400 font-semibold hover:brightness-110 transition-all duration-500">
              <MdArrowBackIosNew />
              <span className="ml-1">Voltar</span>
            </a>
          </Link>
          
        </div>
        <div className="max-w-screen-xl m-auto grid grid-cols-1 sm:grid-cols-2 sm:gap-4 sm:gap-y-10 sm:h-full group p-6 sm:p-8">
          <div className="flex m-auto max-w-screen-sm w-full max-h-96 h-full item-center justify-center rounded-lg overflow-hidden">
            <img
              src={product.attributes.cover.data.attributes.url}
              alt={product.attributes.cover.data.attributes.alternativeText}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="flex flex-col sm:ml-4 justify-center items-center sm:items-start">
            <h3 className="mt-4 sm:mt-0 text-3xl sm:text-4xl md:text-5xl text-gray-700">{product.attributes.title}</h3>
            <p className="mt-4 text-xl sm:text-2xl font-bold text-brown-400">{priceFormatted}</p>
            <button onClick={addToCart} className="flex mt-6 p-2 w-full bg-brown-400 rounded-md text-pink-50 font-bold items-center justify-center hover:brightness-110 transition-all duration-500">
              <RiShoppingBasketFill className='fill-pink-50 w-6 h-6'/> 
              <span className="ml-2">Adicionar à cestinha</span>
            </button>
          </div>
        </div>
        {product.attributes.description &&
        <div className="max-w-screen-xl m-auto p-6 sm:px-8">
          <h3 className="text-xl sm:text-3xl font-semibold text-gray-700">Descrição</h3>
          <p className="mt-4 text-md sm:text-lg font-normal text-gray-700 text-justify">{product.attributes.description}</p>
        </div>
        }

      </div>
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params?.slug

  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: ['cover', 'typesTaste']
  });
  

  const response = await api.get(`products?${query}`)
  const product = response.data.data[0]
 
  return {
    props: {
      product,
    },
    revalidate: 10, // In seconds
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      // { params: {} }
    ],
    fallback: 'blocking',
  };
}
