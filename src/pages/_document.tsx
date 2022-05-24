import { Html, Head, Main, NextScript } from 'next/document'
import Document from 'next/dist/pages/_document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <meta name="theme-color" content="#F2B3CA" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#F2B3CA" />
        <meta name="description" content="Mais Doçuras - Trabalhamos com sonhos!" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mais Doçuras - Delivery" />
        <meta property="og:description" content="Mais Doçuras - Trabalhamos com sonhos!" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}