import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router-dom'
import NotFound from './components/notFound.jsx'
import SelectedProduct from './components/selectedProduct.jsx'

const router = createBrowserRouter([
  {
    path : '/',
    element: <App />,
    errorElement : <NotFound /> ,
  },
  {
    path : '/selectedProduct',
    element : <SelectedProduct />,
  },
  {
    path : '*',
    element : <NotFound />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
