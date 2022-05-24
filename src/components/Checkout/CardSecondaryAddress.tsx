import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function CardSecondaryAdress() {
  const { userData } = useContext(AuthContext)
  return (
    userData?.secondaryAdress ? 
      <div className="flex flex-col items-start gap-2 sm:gap-1 w-full h-full">
        <p className="text-left">Cidade: {userData?.secondaryAdress?.city}</p>
        <p className="text-left">Bairro: {userData?.secondaryAdress?.district}</p>
        <p className="text-left">Rua: {userData?.secondaryAdress?.street}, {userData?.secondaryAdress?.houseNumber}</p>
        {userData?.secondaryAdress?.complement && <p className="text-left">Complemento: {userData.secondaryAdress?.complement}</p>}
        {userData?.secondaryAdress?.referencePoint && <p className="text-left">Ponto de Referência: {userData.secondaryAdress?.referencePoint}</p>}
      </div>
    :
    <p>Endereço secundário não cadastrado</p>
  )
}