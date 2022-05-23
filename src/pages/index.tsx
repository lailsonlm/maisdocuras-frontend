import { ProductsList } from "../components/ProductsList";
import { Header } from "../components/Header";
import Head from "next/head";
import { Footer } from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { userData } = useContext(AuthContext)
  return (
    <>
    <Head>
      <title>Mais Doçuras | Delivery</title>
    </Head>
    <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
      <Header />
      {userData && 
      <div className="max-w-2xl mx-auto pt-2 px-4 sm:px-6 lg:max-w-7xl">
        <h2 className="font-semibold text-brown-400">Olá, {userData.name}!</h2>
      </div>
      }
      <ProductsList/>
    </div>
    <Footer />
    </>
  )
}
