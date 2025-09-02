// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

document.addEventListener('contextmenu', event => event.preventDefault());


const queryClient = new QueryClient();
  
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  // <StrictMode>
  // </StrictMode>,
)
