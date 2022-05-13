import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Loading } from "../Loading";
import { useContext, useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { dbFirestore } from "../../services/firebase";
import { AuthContext } from "../../context/AuthContext";
import { addDoc, collection, deleteDoc, doc, getDocs, query, runTransaction, where } from "firebase/firestore";

type FormData = {
  name: string;
  zipCode: string;
  street: string;
  houseNumber: string;
  complement?: string;
  referencePoint?: string;
  district: string;
  city: string;
  uf: string;
};

type DataDoc = {
  idDoc: string;
  name: string;
  zipCode: string;
  street: string;
  houseNumber: string;
  complement?: string;
  referencePoint?: string;
  district: string;
  city: string;
  uf: string;
  userId: string;
};

type AdressInfo = {
  logradouro: string;
  localidade: string;
  bairro: string;
  uf: string;
}


export function FormProfile() {
  const [zipCode, setZipCode] = useState<string>('')
  const [existDoc, setExistDoc] = useState<DataDoc>()
  const [adress, setAdress] = useState<AdressInfo | null>()

  const validateZipCode = zipCode?.length === 8
  const { userAuth } = useContext(AuthContext)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    setUserId(userAuth)
  }, [userAuth])

  const toastProfileSave = () => toast('Perfil salvo!', {
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

  const schema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    houseNumber: yup.string().required('Número é obrigatório')
  }).required();

  const {
    reset,
    register,
    handleSubmit,
    formState,
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  
  const { errors, isSubmitting } = formState

  useEffect(() => {
    if(validateZipCode) {
      searchAdress()
    }

    setAdress(null)
  }, [validateZipCode])

  function searchAdress() {
    api.get(`https://viacep.com.br/ws/${zipCode}/json/`)
    .then((response) => {
      if(response.data.erro) {
        toast.error('CEP não encontrado.', {
          position: "top-center",
          autoClose: 5000,
        });
      }
      setAdress(response.data)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    async function consultDataProfile() {
      const q = query(collection(dbFirestore, "users"), where("userId", "==", userId));
  
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setExistDoc({ 
          idDoc: doc.id,
          ...doc.data()
        } as DataDoc) 
      });
    }

    consultDataProfile()
    
  }, [userId])

  const onSubmit = async (data: FormData) => {
    if(existDoc) {
      try {
        await runTransaction(dbFirestore, async (transaction) => {
          const sfDoc = await transaction.get(doc(dbFirestore, "users", existDoc.idDoc));
          if (!sfDoc.exists()) {
            throw "Document does not exist!";
          }

          transaction.update(doc(dbFirestore, "users", existDoc.idDoc), {
            userId: userAuth,
            name: data.name,
            zipCode,
            street: adress?.logradouro,
            houseNumber: data.houseNumber,
            complement: data.complement,
            referencePoint: data.referencePoint,
            district: adress?.bairro,
            city: adress?.localidade,
            uf: adress?.uf,
          });

        });
      
        toastProfileSave()
      } catch (e) {
        console.error(e);

        toast.error('Falha ao salvar dados.', {
          position: "top-center",
          autoClose: 5000,
        });
      }
      return;
    }
    
    try {
      const docRef = await addDoc(collection(dbFirestore, "users"), {
        userId: userAuth,
        name: data.name,
        zipCode,
        street: adress?.logradouro,
        houseNumber: data.houseNumber,
        complement: data.complement,
        referencePoint: data.referencePoint,
        district: adress?.bairro,
        city: adress?.localidade,
        uf: adress?.uf,
      });
      
      toastProfileSave()

    } catch(error) {
      toast.error('Falha ao salvar dados.', {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 sm:gap-4 w-full h-full">
      <div className="flex flex-col">
        <label htmlFor="name" className="font-medium text-gray-700">
          Nome
        </label>
        <input
          id="name"
          type="text"
          autoComplete="text"
          className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm ${errors.name && "focus:ring-red-600 focus:border-red-600"}`}
          autoFocus
          defaultValue={existDoc?.name}
          {...register("name")}
          
        />
        {errors.name && <p className="text-xs text-right text-red-600">{errors.name.message}</p>}
      </div>

      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full sm:w-32">
          <label htmlFor="zipCode" className="font-medium text-gray-700">
            CEP
          </label>
          <input
            id="zipCode"
            type="text"
            className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm ${errors.zipCode && "focus:ring-red-600 focus:border-red-600"}`}
            required
            defaultValue={zipCode.length === 0 ? existDoc ? existDoc.zipCode : '' : zipCode}
            onChange={e => setZipCode(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="street" className="font-medium text-gray-700">
            Rua
          </label>
          <input
            id="street"
            type="text"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm "
            disabled
            value={adress ? adress.logradouro : existDoc ?  existDoc?.street : ''}
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
            className={`appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm ${errors.houseNumber && "focus:ring-red-600 focus:border-red-600"}`}
            defaultValue={existDoc?.houseNumber}
            
            {...register("houseNumber")}
          />
          {errors.houseNumber && <p className="text-xs text-red-600">{errors.houseNumber.message}</p>}
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="complement" className="font-medium text-gray-700">
            Complemento
          </label>
          <input
            id="complement"
            type="text"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            defaultValue={existDoc?.complement}
            {...register("complement")}
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
          defaultValue={existDoc?.referencePoint}
          {...register("referencePoint")}
        />
      </div>

      <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
        <div className="flex flex-col w-full sm:w-44">
          <label htmlFor="district" className="font-medium text-gray-700">
            Bairro
          </label>
          <input
            id="district"
            type="text"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            disabled
            defaultValue={adress ? adress.bairro : existDoc ?  existDoc?.district : ''}
            // value={adress ? adress.bairro : ''}
          />
        </div>
        <div className="flex flex-col w-full sm:w-44">
          <label htmlFor="city" className="font-medium text-gray-700">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            disabled
            defaultValue={adress ? adress.localidade : existDoc ?  existDoc?.city : ''}
            // value={adress ? adress.localidade : ''}
          />
        </div>
        <div className="flex flex-col w-full sm:w-20">
          <label htmlFor="uf" className="font-medium text-gray-700">
            UF
          </label>
          <input
            id="uf"
            type="text"
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            disabled
            defaultValue={adress ? adress.uf : existDoc ?  existDoc?.uf : ''}
            // value={adress ? adress.uf : ''}
          />
        </div>
      </div>

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