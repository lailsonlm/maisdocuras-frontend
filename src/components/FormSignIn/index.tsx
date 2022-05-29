import { FirebaseError } from "firebase/app";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { firebaseAuth } from "../../services/firebase";
import { Loading } from "../Loading";

export function FormSignIn() {
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const phoneNumber = `+55${phone.replace(/\D/g,"")}`

  function formatPhoneNumber(value: string){
    value=value.replace(/\D/g,"");
    value=value.replace(/^(\d{2})(\d)/g,"($1) $2");
    value=value.replace(/(\d)(\d{4})$/,"$1-$2");
    
    setPhone(value)
  }

  async function generateRecaptcha() {
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
    }, firebaseAuth);
  }

  async function sendCodeSMS() {
    setIsLoadingSubmit(true)
    await generateRecaptcha();

    const appVerifier = window.recaptchaVerifier
    await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult
      
    }).catch((error) => {
      console.log(error)
    });

    setIsLoadingSubmit(false)
  }

  async function handleSubmit(e: FormEvent) {
    setIsLoadingSubmit(true)
    e.preventDefault();

    if(code.length === 6) {
      const confirmationResult = window.confirmationResult

      await confirmationResult.confirm(code)
        .then((result: any) => {
          const user = result.user;
        }).catch((error: FirebaseError) => {
          toast.error('Erro ao validar código. Tente novamente!', {
            position: "top-center",
            autoClose: 3000,
          });

          setIsLoadingSubmit(false)
        })
    }

    // setIsLoadingSubmit(false)
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="sr-only">
          Digite seu telefone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          maxLength={15}
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
          placeholder="Digite seu telefone"
          value={phone}
          onChange={e => formatPhoneNumber(e.target.value)}
        />
        <button 
          type="button" 
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-400 bg-blue-200 hover:brightness-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 disabled:opacity-80 disabled:hover:brightness-100"
          onClick={sendCodeSMS}
          disabled={isLoadingSubmit && true || phone.length === 0}
        >
          {isLoadingSubmit ? <Loading /> : 'Receber código de confirmação'}
        </button>
      </div>

        <div  className="flex flex-col gap-1">
          <label htmlFor="code" className="sr-only">
            Digite o código
          </label>
          <input
            id="code"
            name="code"
            type="number"
            required
            className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            placeholder="Digite o código"
            value={code} 
            onChange={e => setCode(e.target.value)} 
          />
          <button 
            type="submit" 
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-brown-400 bg-blue-200 hover:brightness-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 disabled:opacity-80 disabled:hover:brightness-100"
            disabled={isLoadingSubmit && true}
          >
            {isLoadingSubmit ? <Loading /> : 'Entrar'}
          </button>
        </div>

        <div  id='sign-in-button'></div>
    </form>
  )
}