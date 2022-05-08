import '../styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { UberProvider } from '../lib/uberContext'

function MyApp({ Component, pageProps }) {
  return (
     <UberProvider>
    <Component {...pageProps} />
    </UberProvider>
  )
}

export default MyApp
