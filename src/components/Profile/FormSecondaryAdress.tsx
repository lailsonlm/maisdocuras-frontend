import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SecondaryAdress } from "./FormProfile";

type FormSecondaryAdressProps = {
  setSecondaryAdress: Dispatch<SetStateAction<SecondaryAdress>>
}

export function FormSecondaryAdress({ setSecondaryAdress }: FormSecondaryAdressProps) {
  const [citySecondary, setCitySecondary] = useState<string>('')
  const [districtSecondary, setDistrictSecondary] = useState<string>('')
  const [houseNumberSecondary, setHouseNumberSecondary] = useState<string>('')
  const [streetSecondary, setStreetSecondary] = useState<string>('')
  const [complementSecondary, setComplementSecondary] = useState<string>('')
  const [referencePointSecondary, setReferencePointSecondary] = useState<string>('')

  const { userData } = useContext(AuthContext)

  useEffect(() => {
    if(userData?.secondaryAdress) {      
      setCitySecondary(userData.secondaryAdress.city)
      setDistrictSecondary(userData.secondaryAdress.district)
      setStreetSecondary(userData.secondaryAdress.street)
      setHouseNumberSecondary(userData.secondaryAdress.houseNumber)
      setComplementSecondary(userData.secondaryAdress.complement)
      setReferencePointSecondary(userData.secondaryAdress.referencePoint)
    }
  }, [userData?.secondaryAdress])

  useEffect(() => {
    setSecondaryAdress({
      street: streetSecondary,
      houseNumber: houseNumberSecondary,
      complement: complementSecondary,
      referencePoint: referencePointSecondary,
      district: districtSecondary,
      city: citySecondary
    })
  }, [streetSecondary, houseNumberSecondary, complementSecondary, referencePointSecondary, districtSecondary, citySecondary])

  return (
    <form className="flex flex-col gap-2 sm:gap-4 w-full h-full">
      <h3 className="sm:mb-2 text-lg text-center font-semibold text-gray-700">Endereço Secundário</h3>
      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full">
          <label htmlFor="city" className="font-medium text-gray-700">
            Cidade
          </label>
          <select 
            id="city" 
            name="city"
            required
            value={citySecondary}
            onChange={e => setCitySecondary(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          >
            <option value=""></option>
            <option value="Paulista">Paulista</option>
            <option value="Abreu e Lima">Abreu e Lima</option>
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="district" className="font-medium text-gray-700">
            Bairro
          </label>
          {citySecondary === 'Paulista' ? 
          <select 
            id="district"
            name="district"
            required
            value={districtSecondary}
            onChange={e => setDistrictSecondary(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          >
            <option value=""></option>
            <option value="Artur Lundgren I">Artur Lundgren I</option>
            <option value="Artur Lundgren II">Artur Lundgren II</option>
            <option value="Aurora">Aurora</option>
            <option value="Centro">Centro</option>
            <option value="Jaguarana">Jaguarana</option>
            <option value="Jaguaribe">Jaguaribe</option>
            <option value="Jardim Paulista Alto">Jardim Paulista Alto</option>
            <option value="Jardim Paulista Baixo">Jardim Paulista Baixo</option>
            <option value="Maranguape I">Maranguape I</option>
            <option value="Maranguape II">Maranguape II</option>
            <option value="Paratibe">Paratibe</option>
            <option value="Vila Torres Galvão">Vila Torres Galvão</option>
          </select>
          : 
          <select 
            id="district"
            name="district"
            required
            value={districtSecondary}
            onChange={e => setDistrictSecondary(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          >
            <option value=""></option>
            <option value="Caetés I">Caetés I</option>
            <option value="Centro">Centro</option>
          </select>
          }
        </div>     
      </div>

      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full">
          <label htmlFor="street" className="font-medium text-gray-700">
            Rua
          </label>
          <input
            id="street"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            value={streetSecondary}
            onChange={e => setStreetSecondary(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full sm:w-32">
          <label htmlFor="houseNumber" className="font-medium text-gray-700">
            Número
          </label>
          <input
            id="houseNumber"
            type="number"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            value={houseNumberSecondary}
            onChange={e => setHouseNumberSecondary(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="complement" className="font-medium text-gray-700">
            Complemento
          </label>
          <input
            id="complement"
            type="text"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            value={complementSecondary}
            onChange={e => setComplementSecondary(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="referencePoint" className="font-medium text-gray-700">
          Ponto de Referência
        </label>
        <input
          id="referencePoint"
          type="text"
          autoComplete="text"
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          value={referencePointSecondary}
          onChange={e => setReferencePointSecondary(e.target.value)}
        />
      </div>
    </form>
  )
}