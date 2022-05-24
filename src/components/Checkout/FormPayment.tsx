import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IoMdCopy } from 'react-icons/io'
import { toast } from "react-toastify";
import { TypePayment } from "../../pages/checkout";

type FormPaymentProps = {
  setTypePayment: Dispatch<SetStateAction<TypePayment>>
}

export function FormPayment({ setTypePayment }: FormPaymentProps) {
  const [formPayment, setFormPaymant] = useState('Cartão')
  const [moneyChange, setMoneyChange] = useState('')

  useEffect(() => {
    setTypePayment({
      formPayment,
      moneyChange
    })
  }, [formPayment, moneyChange])
  
  const notifyCopySucess = () => toast('Copiado para área de transferência', {
    position: "top-center",
    autoClose: 3000,
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

  return (
    <div className="flex flex-col items-center justify-between p-4 sm:p-8 h-full bg-pink-50 sm:mb-0 shadow-md rounded-lg">
      <h3 className="mr-2 text-lg sm:text-2xl text-center font-semibold text-gray-700">Forma de pagamento</h3>
      <form className="flex w-full items-center justify-evenly mt-4">
        <div className="flex gap-2 items-center justify-center">
          <input
            onChange={e => setFormPaymant(e.target.value)}
            className="checked:bg-brown-400 focus:ring-brown-400 hover:outline-brown-400 hover:text-brown-400 text-brown-400" 
            type="radio" 
            id="money" 
            name="paymentForm" 
            value="Dinheiro" />
          <label htmlFor="money">Dinheiro</label>
        </div>

        <div className="flex gap-2 items-center justify-center">
          <input 
            onChange={(e) => {
              setFormPaymant(e.target.value)
              setMoneyChange('')
            }}
            className="checked:bg-brown-400 focus:ring-brown-400 hover:outline-brown-400 hover:text-brown-400 text-brown-400" 
            type="radio" 
            defaultChecked
            id="card" 
            name="paymentForm" 
            value="Cartão" />
          <label htmlFor="card">Cartão</label>
        </div>

        <div className="flex gap-2 items-center justify-center">
          <input 
            onChange={(e) => {
              setFormPaymant(e.target.value)
              setMoneyChange('')
            }}
            className="checked:bg-brown-400 focus:ring-brown-400 hover:outline-brown-400 hover:text-brown-400 text-brown-400" 
            type="radio" 
            id="pix" 
            name="paymentForm" 
            value="PIX" />
          <label htmlFor="pix">PIX</label>
        </div>
      </form>

      {formPayment === 'Dinheiro' ?
        <div className="flex flex-col w-full mt-8 gap-1">
          <label htmlFor="moneyChange" className="font-medium text-gray-700">
            Troco para:
          </label>
          <input
            id="moneyChange"
            type="number"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-200 focus:border-blue-200 focus:z-10 sm:text-sm"
            autoFocus
            placeholder="0"
            value={moneyChange}
            onChange={e => setMoneyChange(e.target.value)}
          />
        </div>
      : formPayment === 'PIX' &&
      <>
          <p className="text-brown-400 font-bold mt-6 sm:mt-4">
            * Favor, enviar comprovante de pagamento!
          </p>
        <CopyToClipboard text="81979132765">
          <button 
          type="button" 
          onClick={() => notifyCopySucess()}
          className="group mt-2 relative w-full flex justify-center items-center gap-1 py-2 px-4 border border-transparent text-sm font-bold rounded-md text-brown-400 bg-blue-200 hover:brightness-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
          >
            81979132765
            <IoMdCopy/>
          </button>
        </CopyToClipboard>
      </>
      }
    </div>
  )
}