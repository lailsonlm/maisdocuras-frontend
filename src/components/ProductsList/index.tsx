import { useState } from "react";
import { BiFoodMenu } from "react-icons/bi";
import { BsCupStraw } from "react-icons/bs";
import { GiCupcake, GiPieSlice } from "react-icons/gi";
import { HiOutlinePlus } from "react-icons/hi";
import { ButtonCategories } from "../ButtonCategories";
import { ProductsByCategory } from "../ProductsByCategory";

export function ProductsList() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl">
      <h2 className="sr-only">Produtos</h2>
      
      <div className="flex h-24 flex-nowrap gap-x-2 sm:gap-x-4 items-center overflow-x-auto">
        <ButtonCategories 
          title='Todas' 
          Icon={BiFoodMenu} 
          onClick={() => setSelectedCategory('all')} 
          isActive={selectedCategory === 'all' && true}
        />
        <ButtonCategories 
          title='Doces' 
          Icon={GiCupcake}  
          onClick={() => setSelectedCategory('candy')} 
          isActive={selectedCategory === 'candy' && true}
          />
        <ButtonCategories 
          title='Salgados' 
          Icon={GiPieSlice} 
          onClick={() => setSelectedCategory('salty')} 
          isActive={selectedCategory === 'salty' && true}  
        />
        <ButtonCategories 
          title='Bebidas' 
          Icon={BsCupStraw} 
          onClick={() => setSelectedCategory('drinks')} 
          isActive={selectedCategory === 'drinks' && true} 
        />
        <ButtonCategories 
          title='Combos' 
          Icon={HiOutlinePlus} 
          onClick={() => setSelectedCategory('combos')} 
          isActive={selectedCategory === 'combos' && true} 
        />
      </div>

      {selectedCategory === 'all' ?
        <>
          <ProductsByCategory category='Doces' />
          <ProductsByCategory category='Salgados' />
          <ProductsByCategory category='Bebidas' />
          <ProductsByCategory category='Combos' />
        </>
        : selectedCategory === 'candy' ?
          <ProductsByCategory category='Doces' />
        : selectedCategory === 'salty' ?
          <ProductsByCategory category='Salgados' />
        : selectedCategory === 'drinks' ?
          <ProductsByCategory category='Bebidas' />
        : selectedCategory === 'combos' ?
          <ProductsByCategory category='Combos' />
        : ''
      }

    </div>
  )
}
