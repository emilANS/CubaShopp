import { useEffect, useState } from "react"

import axios from "axios"

function StatisticsPage() {

  /* Here is the port of the server frontend will be connected */
  const portOfServer = "http://localhost:4000/"

  /* Total gained in money from all products */
  const [totalGained, setTotalGained] = useState(0)

  /* Statistics information about products */
  const [productsInformation, setProductsInformation] = useState([])

  useEffect(() => {

    axios.get(`${portOfServer}send-information-to-statistics-to-admin`).then(res => {

      setProductsInformation(res.data)

      console.log(res.data)

    })

  }, [])

  let allPricesJoined = []

  useEffect(() => {

    productsInformation.forEach(productsInformationElements => {

      allPricesJoined.push(productsInformationElements.totalGainedFromThisBuy)

      if (allPricesJoined.length === productsInformation.length) {

        setTotalGained(allPricesJoined.reduce((x, y) => x + y))

      }

    })

  }, [allPricesJoined])

  return (

    <div>

      <h1 className="text-xl">Bienvenido a la seccion de estadisticas</h1>

      <button className="register-link border-2 w-36 duration-500 hover:bg-stone-800 bg-stone-700 rounded-md text-white" onClick={() => window.location.href = "http://localhost:5173/AdminPage1"}>Ir atras</button>

      <h1 className="text-2xl font-bold">Total de dinero ganado: {totalGained}$</h1>

      <h2 className="text-xl mb-3">Estadisticas de compras:</h2>

      <hr></hr>

      {productsInformation.map(productsElements => {

        return (

          <div className="sm:w-auto sm:h-auto border-4 mb-8 border-stone-400 hover:border-stone-500 shadow-xl duration-500 hover:shadow-2xl rounded-xl m-auto top-0 bottom-0 right-0 left-0 w-auto h-auto">

            {productsElements.statusOfBuy === "El producto se vendio perfectamente" ?

              <>

                <h2 className="name-of-products-admin-statistic">{JSON.parse(productsElements.nameOfProducts).join(" ")}</h2>

                <h2 className="name-of-products-admin-statistic">Numero del carnet del cliente: {productsElements.carnetNumberOfClient}</h2>

                <h2 className="name-of-products-admin-statistic-number">Nombre del cliente: {productsElements.nameOfTheClient}</h2>

                <hr className="border-stone-500"></hr>

                <h1 className="name-of-products-admin-statistic">{productsElements.statusOfBuy}</h1>

                <h2 className="name-of-products-admin-statistic">Total ganado de esta compra: {productsElements.totalGainedFromThisBuy} $</h2>

                <h3 className="name-of-products-admin-statistic">Id del producto o de los productos: {productsElements.idOfProducts}</h3>


              </>

              :

              <>

                <h2 className="name-of-products-admin-statistic">{JSON.parse(productsElements.nameOfProducts).join(" ")}</h2>

                <h2 className="name-of-products-admin-statistic-number">Numero del carnet del cliente: {productsElements.carnetNumberOfClient}</h2>

                <h2 className="name-of-products-admin-statistic-number">Nombre del cliente: {productsElements.nameOfTheClient}</h2>

                <hr className="border-stone-500"></hr>

                <h1 className="name-of-products-admin-statistic">{productsElements.statusOfBuy}</h1>

                <h2 className="name-of-products-admin-statistic-number">Cantidad que tenia que pagar el cliente: {productsElements.totalGainedFromThisBuy} $</h2>

                <h3 className="name-of-products-admin-statistic-number">Id del producto o de los productos: {productsElements.idOfProducts}</h3>

              </>

            }

          </div>

        )

      })}

    </div>

  )

}

export default StatisticsPage