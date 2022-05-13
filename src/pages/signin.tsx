import { FirebaseError } from "firebase/app";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import nookies from 'nookies'

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import { FormSignIn } from "../components/FormSignIn";

export default function SignIn() {
  const { isAuthenticated } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if(isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated])



  return (
    <>
    <Head>
      <title>Mais Doçuras | Entrar</title>
    </Head>
    <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
      <Header />
      <div className="flex flex-col min-h-full items-center justify-center">
        <div className="max-w-md w-full my-16 flex flex-col items-center justify-center px-4 sm:px-0">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-700">Faça login em sua conta</h2>
          <p className="mb-6 mt-1 text-center text-xs sm:text-sm text-gray-700">Um SMS será enviado para seu número com o código de confirmação!</p>
          <FormSignIn />
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

  if(token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  
  return {
    props: {}
  }
}