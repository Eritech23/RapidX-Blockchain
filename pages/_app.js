import '../styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { RapidXProvider,RapidXContext } from '../context/rapidXcontext'

function MyApp({ Component, pageProps }) {
  return (
     <RapidXProvider>
    <Component {...pageProps} />
    </RapidXProvider>
  )
}

export default MyApp
