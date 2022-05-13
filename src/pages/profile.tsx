import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import nookies from 'nookies'

import { Footer } from "../components/Footer";
import { FormProfile } from "../components/FormProfile";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { handleSignOut } = useContext(AuthContext)

  return (
    <>
    <Head>
      <title>Mais Doçuras | Meu Perfil</title>
    </Head>
    <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
      <Header />
      <div className="flex flex-col min-h-full items-center justify-center">
        <div className="max-w-md w-full my-16 flex flex-col items-center justify-center px-4 sm:px-0">
          <div className="max-w-md w-full flex items-center justify-end">
            <button 
              type="button" 
              onClick={handleSignOut}
              className="text-brown-400 font-semibold hover:brightness-110 transition-all duration-500"
            >
              Sair da minha conta
            </button>
          </div>
          <h2 className="my-6 text-center text-3xl font-bold text-gray-700">Meus Dados</h2>
          <FormProfile />
        </div>
      </div>
    </div>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)
  const token = cookies['maisdocuras.token']

  if(!token) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }
  
  return {
    props: {}
  }
}