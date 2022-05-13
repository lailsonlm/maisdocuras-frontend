import { ProductsList } from "../components/ProductsList";
import { Header } from "../components/Header";
import Head from "next/head";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <>
    <Head>
      <title>Mais Doçuras | Delivery</title>
    </Head>
    <div className="min-h-[calc(100vh-6rem)] bg-pink-300">
      <Header />
      <ProductsList/>
    </div>
    <Footer />
    </>
  )
}
