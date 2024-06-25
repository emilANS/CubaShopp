import { BrowserRouter, Routes, Route } from "react-router-dom"

import LoginPage from "./shopComponents/LoginPage"

import RegisterPage from "./shopComponents/RegisterPage"

import ShopPage from "./shopComponents/ShopPage"

import PayProductsPage from "./shopComponents/PayProductsPage"

import StatisticsPage from "./shopComponents/StatisticsPage"

import StatisticsPageClient from "./shopComponents/StatisticsPageClient"

import DeliveryPage from "./shopComponents/DeliveryPage"

import AdminPage from "./shopComponents/AdminPage"

import ProtectedRoute from "./ProtectedRoute"

import "./App.css"

function App() {

  return (

    <>
      <BrowserRouter>

        <Routes>
          
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<ShopPage />} />

          <Route element={<ProtectedRoute />}>

            <Route path="/shopPageUserLogged" element={<ShopPage />} />

            <Route path="/shopPage/payProducts" element={<PayProductsPage />} />

            <Route path="/statisticsOfUser" element={<StatisticsPageClient />} />

            <Route path="/AdminPage1" element={<AdminPage />} />

            <Route path="/AdminPage1/StatisticsPage" element={<StatisticsPage />} />

            <Route path="/AdminPage1/DeliveryPage" element={<DeliveryPage />} />

          </Route>

        </Routes>

      </BrowserRouter>

    </>

  )
}

export default App
