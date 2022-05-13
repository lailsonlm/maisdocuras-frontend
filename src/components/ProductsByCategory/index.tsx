import { api } from "../../services/api"
import qs from 'qs'
import { useEffect, useState } from "react";
import { formatPrice } from "../../util/format";

interface ProductsByCategoryProps {
  category: string;
}

interface ProductsProps {
  id: string;
  attributes: {
    title: string;
    slug: string;
    price: number;
    description: string;

    category: {
      data: {
        attributes: {
          slug: string;
        }
      }
    }

    cover: {
      data: {
        attributes: {
          alternativeText: string;
          url: string,
          formats: {
            medium: {
              url: string,
            },
            small: {
              url: string,
            },
            thumbnail: {
              url: string,
            },
          }
        }
      }
    }
  }
}

export function ProductsByCategory({ category }: ProductsByCategoryProps) {
  const [products, setProducts] = useState<ProductsProps[]>([])

  async function getProductsByCategory() {
    const query = qs.stringify({
      filters: {
        category: {
          name: {
            $eq: category,
          },
        },
        active: {
          $eq: 'true'
        }
      },
      sort: ['title:ASC'],
      populate: '*'
    });
    
    const response = await api.get(`products?${query}`)
    const productsList = response.data.data

    setProducts(productsList)
  }

  useEffect(() => {
    getProductsByCategory()
  }, [category])

  return (
    <>
      <h1 className="text-2xl mt-8 sm:mt-12 mb-2 font-bold text-brown-400">{category}</h1>
      <div className="grid grid-cols-1 gap-y-4 sm:gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <a key={product.id} href={`/product/${product.attributes.slug}`} className="flex sm:block sm:h-full group p-4 rounded-lg bg-pink-50 shadow-lg sm:shadow-xl">
            <div className="w-40 h-40 sm:w-full aspect-w-1 sm:aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-6">
              <img
                src={product.attributes.cover.data.attributes.url}
                alt={product.attributes.cover.data.attributes.alternativeText}
                className="w-full h-full object-center object-cover group-hover:opacity-75 duration-300"
              />
            </div>
            <div className="flex flex-col ml-4 justify-center">
              <h3 className="mt-4 text-lg font-semibold text-gray-700">{product.attributes.title}</h3>
              <p className="mt-1 text-lg font-medium text-brown-400">{formatPrice(product.attributes.price)}</p>
            </div>
          </a>
        ))}
    </div>
    </>
  )
}

