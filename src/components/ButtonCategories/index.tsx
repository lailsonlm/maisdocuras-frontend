import { IconType } from "react-icons";

interface ButtonCategoriesProps {
  isActive?: boolean;
  title: string;
  Icon: IconType;
  onClick: () => void;
}

export function ButtonCategories({ isActive, title, Icon, onClick }: ButtonCategoriesProps) {
  return (
    isActive ?
      <button 
        className="flex flex-col justify-center items-center group py-2 px-6 h-full w-24 rounded-lg bg-brown-400 shadow-lg"
        onClick={onClick}  
      >
        <div className="w-full  rounded-lg overflow-hidden">
          <Icon className="group-hover:opacity-75 w-12 h-12 duration-300 fill-pink-50 stroke-pink-50"/>
        </div>
        <p className="mt-1 text-sm font-bold text-pink-50">{title}</p>
      </button>
    :

    <button 
      className="flex flex-col justify-center items-center group py-2 px-6 h-full w-24 rounded-lg bg-pink-400 shadow-lg"
      onClick={onClick} 
    >
      <div className="w-full  rounded-lg overflow-hidden">
        <Icon className="group-hover:opacity-75 w-12 h-12 duration-300 fill-pink-50 stroke-pink-50"/>
      </div>
      <p className="mt-1 text-sm font-bold text-pink-50">{title}</p>
    </button>
  )
}