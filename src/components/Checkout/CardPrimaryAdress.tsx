import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function CardPrimaryAdress() {
  const { userData } = useContext(AuthContext)

  return (
    <div className="flex flex-col items-start gap-2 sm:gap-1 w-full h-full">
      <p className="text-left">Cidade: {userData?.city}</p>
      <p className="text-left">Bairro: {userData?.district}</p>
      <p className="text-left">Rua: {userData?.street}, {userData?.houseNumber}</p>
      {userData?.complement && <p className="text-left">Complemento: {userData.complement}</p>}
      {userData?.referencePoint && <p className="text-left">Ponto de Referência: {userData.referencePoint}</p>}
    </div>
  )
}