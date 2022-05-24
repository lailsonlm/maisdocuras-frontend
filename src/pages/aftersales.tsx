import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext } from "react";
import nookies from 'nookies'
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";

export default function AfterSales() {
  const { userData } = useContext(AuthContext)
  return (
    <>
    <Head>
      <title>Mais Doçuras | Agradecemos a preferência!</title>
    </Head>
    <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
      <Header />
      <div className="max-w-2xl flex flex-col items-center justify-center gap-4 h-full mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl">
        <div className="items-start w-full max-w-screen-xl">
          <Link href="/">
            <a className="flex w-48 items-center text-brown-400 font-semibold hover:brightness-110 transition-all duration-500">
              <MdArrowBackIosNew />
              <span className="ml-1 text-md">Voltar ao início</span>
            </a>
          </Link>
        </div>
        <h2 className="font-semibold text-2xl mt-10 text-center sm:text-3xl text-brown-400">{userData?.name}, agradecemos a preferência ❤️</h2>
        <p className="text-center">Esperamos que você adoce sua vida e retorne sempre!!!</p>
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