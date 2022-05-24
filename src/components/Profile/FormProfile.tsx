import { useForm } from "react-hook-form";
import { Loading } from "../Loading";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { dbFirestore } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";
import { addDoc, collection, doc, runTransaction } from "firebase/firestore";
import { FormSecondaryAdress } from "./FormSecondaryAdress";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

export type SecondaryAdress = {
  street: string;
  houseNumber: string;
  complement: string;
  referencePoint: string;
  district: string;
  city: string;
}

export function FormProfile() {
  const [name, setName] = useState<string>('')
  const [city, setCity] = useState<string>()
  const [district, setDistrict] = useState<string>()
  const [houseNumber, setHouseNumber] = useState<string>('')
  const [street, setStreet] = useState<string>('')
  const [complement, setComplement] = useState<string | undefined>('')
  const [referencePoint, setReferencePoint] = useState<string | undefined>('')
  const [isExpandedSecondaryAdress, setIsExpandedSecondaryAdress] = useState(false)
  const [secondaryAdress, setSecondaryAdress] = useState({} as SecondaryAdress)
  
  const { userAuth, userData } = useContext(AuthContext)

  useEffect(() => {
    if(userData) {      
      setName(userData.name)
      setCity(userData.city)
      setDistrict(userData.district)
      setStreet(userData.street)
      setHouseNumber(userData.houseNumber)
      setComplement(userData.complement)
      setReferencePoint(userData.referencePoint)
    }
  }, [userData])


  const toastProfileSave = () => toast('Perfil salvo!', {
    position: "top-center",
    autoClose: 2000,
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

  const {
    handleSubmit,
    formState,
  } = useForm<FormData>({});
  
  const { isSubmitting } = formState


  const onSubmit = async () => {
    if(userData) {
      try {
        await runTransaction(dbFirestore, async (transaction) => {
          const sfDoc = await transaction.get(doc(dbFirestore, "users", userData.idDoc));
          if (!sfDoc.exists()) {
            throw "Document does not exist!";
          }

          transaction.update(doc(dbFirestore, "users", userData.idDoc), {
            userId: userAuth,
            name,
            street,
            houseNumber,
            complement,
            referencePoint,
            district,
            city,
            secondaryAdress: {
              street: secondaryAdress.street,
              houseNumber: secondaryAdress.houseNumber,
              complement: secondaryAdress.complement,
              referencePoint: secondaryAdress.referencePoint,
              district: secondaryAdress.district,
              city: secondaryAdress.city,
            }
          });

        });
      
        toastProfileSave()
      } catch (e) {
        console.error(e);

        toast.error('Falha ao salvar dados.', {
          position: "top-center",
          autoClose: 2000,
        });
      }
      return;
    }
    
    try {
      const docRef = await addDoc(collection(dbFirestore, "users"), {
        userId: userAuth,
        name,
        street,
        houseNumber,
        complement,
        referencePoint,
        district,
        city,
        secondaryAdress: {
          street: secondaryAdress.street,
          houseNumber: secondaryAdress.houseNumber,
          complement: secondaryAdress.complement,
          referencePoint: secondaryAdress.referencePoint,
          district: secondaryAdress.district,
          city: secondaryAdress.city,
        }
      });
      
      toastProfileSave()

    } catch(error) {
      toast.error('Falha ao salvar dados.', {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 sm:gap-4 w-full h-full">
      <div className="flex flex-col">
        <label htmlFor="name" className="font-medium text-gray-700">
          Nome *
        </label>
        <input
          id="name"
          type="text"
          autoComplete="text"
          required
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full">
          <label htmlFor="city" className="font-medium text-gray-700">
            Cidade *
          </label>
          <select 
            id="city" 
            name="city"
            required
            value={city}
            onChange={e => setCity(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          >
            <option value=""></option>
            <option value="Paulista">Paulista</option>
            <option value="Abreu e Lima">Abreu e Lima</option>
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="district" className="font-medium text-gray-700">
            Bairro *
          </label>
          {city === 'Paulista' ? 
          <select 
            id="district"
            name="district"
            required
            value={district}
            onChange={e => setDistrict(e.target.value)}
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
            value={district}
            onChange={e => setDistrict(e.target.value)}
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
            Rua *
          </label>
          <input
            id="street"
            type="text"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            value={street}
            onChange={e => setStreet(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full sm:w-32">
          <label htmlFor="houseNumber" className="font-medium text-gray-700">
            Número *
          </label>
          <input
            id="houseNumber"
            type="number"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            value={houseNumber}
            onChange={e => setHouseNumber(e.target.value)}
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
            value={complement}
            onChange={e => setComplement(e.target.value)}
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
          value={referencePoint}
          onChange={e => setReferencePoint(e.target.value)}
        />
      </div>

      <button
      type="button"
        onClick={() => setIsExpandedSecondaryAdress(!isExpandedSecondaryAdress)}
        className="flex items-center mt-6 sm:mt-4 justify-center appearance-none rounded-md relative text-sm font-medium px-3 py-2 border-2 border-pink-400  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400  hover:bg-pink-400 transition-all duration-500"
      >
        Cadastrar endereço secundário (Opcional)
        {isExpandedSecondaryAdress ? <MdExpandLess/> : <MdExpandMore />}
      </button>

      {isExpandedSecondaryAdress && <FormSecondaryAdress setSecondaryAdress={setSecondaryAdress}/>}

      <button 
        type="submit" 
        className="group mt-6 sm:mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-400 bg-blue-200 hover:brightness-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 disabled:opacity-80 disabled:hover:brightness-100"
        disabled={isSubmitting && true}
      >
        {isSubmitting ? <Loading /> : 'Salvar'}
      </button>
    </form>
  )
}