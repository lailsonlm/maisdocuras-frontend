import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CartProvider } from '../context/CartContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/AuthContext';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp
