import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import App from './App'
import theme from './theme'
import { LanguageProvider } from './contexts/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </LanguageProvider>
    </ChakraProvider>
  </React.StrictMode>
)