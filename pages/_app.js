// pages/_app.js
// Configuração global do Next.js

import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
