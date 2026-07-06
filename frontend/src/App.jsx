import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from "sonner"
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPages from './pages/CollectionPages'
import ProductsDetails from './components/Products/ProductsDetails'
import CheckOut from './components/Cart/CheckOut'
import OrderConformationPage from './pages/OrderConformationPage'
import OrderdDetails from './pages/OrderdDetails'
import MyOrdersPage from './pages/MyOrdersPage'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'
import UserManagment from './components/Admin/UserManagment'
import ProductsMangement from './components/Admin/ProductsMangement'
import EditProductPage from './components/Admin/EditProductPage'
import OrderManegment from './components/Admin/OrderManegment'
import ProductRoutes from './components/Common/ProtectedRoute'

import { Provider } from 'react-redux'
import store from './redux/store'

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

          <Toaster position="top-right" />
          <Routes>
            <Route path='/' element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='profile' element={<Profile />} />
              <Route path='collections/:collection' element={<CollectionPages />} />
              <Route path="product/:id" element={<ProductsDetails />} />
              <Route path="checkout" element={<CheckOut />} />
              <Route path="order-conformation" element={<OrderConformationPage />} />
              <Route path="order/:id" element={<OrderdDetails />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
            </Route>
            {/* admin layout  */}
            <Route path='/admin' element={
              <ProductRoutes role="admin">
                <AdminLayout />
              </ProductRoutes>
            }>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagment />} />
              <Route path="products" element={<ProductsMangement />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManegment />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
