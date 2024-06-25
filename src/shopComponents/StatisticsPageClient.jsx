import { useState, useEffect } from "react"

import axios from "axios"

function StatisticsPageClient() {

  const [productsDeliveredToUser, setProductsDeliveredToUser] = useState([])

  // Here is the port of the server frontend will be connected
  const portOfServer = "http://localhost:4000/"

  useEffect(() => {

    const idOfUser = sessionStorage.getItem("idOfUser")

    axios.get(`${portOfServer}send-information-to-statistics-to-client`, { params: { idOfUser: idOfUser } }).then(res => {

      setProductsDeliveredToUser(res.data)

    })

  }, [])

  return (

    <>

      <h1 className="text-2xl mb-4">Bienvenido a la seccion de entregas</h1>

      <button className="register-link border-2 w-36 mb-4 duration-500 hover:bg-stone-800 bg-stone-700 rounded-md text-white" onClick={() => window.location.href = "http://localhost:5173/"}>Ir a la tienda de nuevo</button>

      {productsDeliveredToUser.map((productsElements, indexOfProducts) => {

        return (

          <div className="sm:w-[290px] block border-4 mb-4 border-stone-400 hover:border-stone-500 shadow-xl duration-500 hover:shadow-2xl rounded-xl m-auto top-0 bottom-0 right-0 left-0 w-[1000px] h-auto">

            <h1 className="text-xl">Entrega numero {indexOfProducts + 1}</h1>

            <h2 className="name-of-products">{productsElements.nameOfProducts || productsElements.nameOfProduct}</h2>

            <h2 className="text-lg">Total pagado {productsElements.totalGainedFromThisBuy || productsElements.priceInTotal}</h2>

            {productsElements.quantityOfProduct && <h1>Cantidad siendo entregada {productsElements.quantityOfProduct}</h1>}

          </div>

        )

      })}

    </>

  )

}

export default StatisticsPageClient
