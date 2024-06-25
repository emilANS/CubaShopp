import { useEffect, useState } from "react"

import axios from "axios"

function DeliveryPage() {

  /* Here is the port of the server frontend will be connected */
  const portOfServer = "http://localhost:4000/"

  /* UseState for displaying all products being delivered */
  const [productsBeingDelivered, setProductsBeingDelivered] = useState([])

  useEffect(() => {

    axios.get(`${portOfServer}send-products-in-delivery`).then(res => {

      setProductsBeingDelivered(res.data)

    })

  }, [])

  let arrayWithNameAndQuantityOfProducts = []

  productsBeingDelivered.forEach((extractProductElements, indexOfExtractedProducts) => {

    arrayWithNameAndQuantityOfProducts.push({ id: extractProductElements.idOfProduct })

    if (arrayWithNameAndQuantityOfProducts[indexOfExtractedProducts].id === extractProductElements.idOfProduct) {

      let temporalArray = []

      for (let index = 0; index < JSON.parse(extractProductElements.nameOfProduct).length; index++) {

        index !== JSON.parse(extractProductElements.nameOfProduct).length - 1 ? temporalArray.push("Nombre del producto: " + JSON.parse(extractProductElements.nameOfProduct)[index] + " Cantidad:  " + JSON.parse(extractProductElements.quantityOfProduct)[index] + " Y ")
          : temporalArray.push("Nombre del producto: " + JSON.parse(extractProductElements.nameOfProduct)[index] + " Cantidad:  " + JSON.parse(extractProductElements.quantityOfProduct)[index])

      }

      Object.assign(arrayWithNameAndQuantityOfProducts[indexOfExtractedProducts], { nameAndQuantityOfProducts: temporalArray })

    }

    Object.assign(productsBeingDelivered[indexOfExtractedProducts], { nameAndQuantityOfProducts: arrayWithNameAndQuantityOfProducts[indexOfExtractedProducts] })

  })

  const deliveryStatusInformation = (dataAboutDelivery) => {

    axios.get(`${portOfServer}was-product-successfully-delivered`, { params: { informationOfProduct: dataAboutDelivery.informationOfProduct, specificDeliveryStatus: dataAboutDelivery.statusOfDelivery } })

    setProductsBeingDelivered(productsBeingDelivered.filter(filterElements => filterElements !== dataAboutDelivery.informationOfProduct))

  }

  return (

    <div>

      <h1 className="text-3xl">Bienvenido a la seccion de envios</h1>

      <button className="register-link border-2 w-36 duration-500 hover:bg-stone-800 bg-stone-700 rounded-md text-white" onClick={() => window.location.href = "http://localhost:5173/AdminPage1"}>Ir atras</button>

      <hr></hr>

      {productsBeingDelivered.map(productElements => {

        return (

          <div className="sm:w-auto sm:h-auto mb-7 border-4 border-stone-400 hover:border-stone-500 shadow-xl duration-500 hover:shadow-[0_50px_70px_3px_rgba(0,0,0,0.3)] rounded-xl m-auto top-0 bottom-0 right-0 left-0 w-[1000px] h-[500px]">

            <h1 className="text-xl">Nombres y cantidades del producto</h1>

            <hr></hr>

            {productElements.nameAndQuantityOfProducts.nameAndQuantityOfProducts.map(elements => {

              return (

                <>

                  <h2 className="text-2xl">{elements}</h2>

                </>

              )

            })}

            <hr></hr>

            <h1 className="text-xl">Direccion del cliente</h1>

            <h2>{productElements.directionOfClient}</h2>

            <h1 className="text-xl">Numero del carnet del cliente</h1>

            <h2>{productElements.carnetIdNumber}</h2>

            <h1 className="text-xl">Nombre del cliente</h1>

            <h2>{productElements.nameOfUser}</h2>

            <h1 className="text-xl">Numero telefonico de cliente</h1>

            <h2>{productElements.telephoneNumberClient}</h2>

            <h1 className="text-xl">Total que el usuario debe pagar</h1>

            <h2 className="mb-8">{productElements.priceInTotal} $</h2>

            <button className="sm:mr-0 relative border-2 rounded-lg w-60 mr-4 duration-500 hover:bg-green-700 bg-green-600 text-white"  onClick={() => deliveryStatusInformation({ informationOfProduct: productElements, statusOfDelivery: true })}>Aceptar que esta compra a sido entregada a el hogar o ubicacion del cliente</button>

            <button className="bg-red-500 duration-300 mb-3 mt-2 text-white hover:bg-red-600 w-60 rounded-lg" onClick={() => deliveryStatusInformation({ informationOfProduct: productElements, statusOfDelivery: false })}>Negar esta compra los productos no fueron entragados correctamente</button>

            <hr></hr>

          </div>

        )

      })}

    </div>

  )

}

export default DeliveryPage