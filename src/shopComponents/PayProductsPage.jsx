import { useEffect, useState, useReducer } from "react"

import axios from "axios"

function PayProductsPage() {

  /* Here is the port of the server frontend will be connected */
  const portOfServer = "http://localhost:4000/"

  /* UseState to display to user the quantity that has to pay */
  const [totalToPay, setTotalToPay] = useState(0)

  /* UseStates of information about user that is about to buy */
  const [productsInCart, setProductsInCart] = useState(JSON.parse(sessionStorage.getItem("productsInCart")))

  const [locationOfUser, setLocationOfUser] = useState("")

  const [nameOfUser, setNameOfUser] = useState("")

  const [idNumberUser, setIdNumberUser] = useState("")

  const [telephoneNumberOfUser, setTelephoneNumberOfUser] = useState("")

  const [userClickedSubmit, setUserClickedSubmit] = useState(false)

  /* UseReducer for updating page when is necessary */
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  /* Warnings to user */
  const [inputsAreEmpty, setInputsAreEmpty] = useState(false)

  /* Events of Credentials of user */
  const eventLocationOfUser = (event) => {
    setLocationOfUser(event.target.value)
  }

  const eventNameOfUser = (event) => {
    setNameOfUser(event.target.value)
  }

  const eventIdNumberUser = (event) => {
    setIdNumberUser(event.target.value)
  }

  const eventTelephoneNumberOfUser = (event) => {
    setTelephoneNumberOfUser(event.target.value)
  }

  /* Array for storing all the prices of the products and then sum it all */
  let pricesOfProducts = []

  useEffect(() => {

    if (userClickedSubmit === false && sessionStorage.getItem("canUserEnterPayProduct") === "true") {

      /* Sum all values of pricesOfProducts Array */
      setTotalToPay(pricesOfProducts.reduce((a, x) => a + x))

    }

  }, [pricesOfProducts])

  const buy = async () => {

    if (document.getElementById("direction-input").value === "" || document.getElementById("name-input-pay-products").value === "" || document.getElementById("id-number-input").value === "" || document.getElementById("phone-number-input").value === "") {

      setInputsAreEmpty(true)

      return

    }

    let productsToSendToBackend = []

    productsInCart.forEach(products => {

      productsToSendToBackend.push({ idOfProduct: products.idOfProduct, nameOfProduct: products.nameOfProduct, quantityUserWant: products.quantityUserWant })

    })

    axios.get(`${portOfServer}send-products-to-delivery`, { params: { totalPrice: totalToPay, telephoneNumberOfUser: telephoneNumberOfUser, locationOfUser: locationOfUser, nameOfUser: nameOfUser, idNumberUser: idNumberUser, products: productsToSendToBackend, idOfUser: sessionStorage.getItem("idOfUser") } })

    setUserClickedSubmit(true)

    sessionStorage.setItem("userClickedSubmit", true)

    sessionStorage.removeItem("userClickedSubmit")

    setInputsAreEmpty(false)

  }

  useEffect(() => {

    if (sessionStorage.getItem("userClickedSubmit") === "true") {

      setUserClickedSubmit(true)

    }

  }, [userClickedSubmit])

  return (

    <div className="sm:bg-white min-h-screen bg-gray-200">

      <div className="inline-block">

        {userClickedSubmit === false ?

          <>

            <div className="sm:w-[400px] border-4 w-[700px] mb-4 bg-white rounded-xl">

              <h1 className="mb-4 font-bold text-xl justify-start">Carrito</h1>


              {productsInCart.map((productsForPaying) => {

                /* Push prices of each product */
                pricesOfProducts.push(productsForPaying.priceOfProduct * productsForPaying.quantityUserWant)

                const decreaseOrIncrementQuantity = (event) => {

                  /* Input Real Time Balance Change */

                  /* If the input value is greater than the quantity of the product add the original quantity to the quantity user wants */
                  event.target.value > productsForPaying.quantityOfProduct && [event.target.value = productsForPaying.quantityOfProduct]

                  /* Each result from the for loop to after the for loop sum */
                  let eachResultOfCalculationToBeSum = []

                  /* Iterate in all elements in the list and then add the values to eachResultOfCalculationToBeSum */
                  Array.from(document.querySelectorAll("input[type='text']")).forEach((valueOfQuantityUserWant, index) => {

                    if (valueOfQuantityUserWant.id.includes("specify-quantity-of-product-user-want-id")) {

                      /* Push every result to the list */
                      eachResultOfCalculationToBeSum.push(productsInCart[index].priceOfProduct * parseInt(valueOfQuantityUserWant.value))

                    }

                  })

                  /* Put the result on balance by calculating all of their values */
                  setTotalToPay(eachResultOfCalculationToBeSum.reduce((x, y) => x + y))

                  Object.assign(productsForPaying, { quantityUserWant: parseInt(event.target.value) })

                }

                return (

                  <div className="flex mb-8">

                    <img className="ml-4 sm:w-[20%] sm:h-[100%] w-[180px] object-contain h-[180px]" src={productsForPaying.imageFormattedForBeingDisplayedInFrontend}></img>

                    <div className="ml-10">

                      <h2 className="sm:border-0 sm:border-t-2 sm:rounded-md sm:mr-0 mr-4 text-lg font-bold">{productsForPaying.nameOfProduct}</h2>

                      <h2 className="text-xl">Tiempo de entrega entre 3 dias</h2>

                      {window.screen.availWidth < 912 &&

                        <h2 className="font-bold">US {productsForPaying.priceOfProduct}$</h2>

                      }


                      <input className="border-2 rounded-lg mt-7 border-gray-700" type="text" id={`specify-quantity-of-product-user-want-id:${productsForPaying.idOfProduct}-cart-list`} value={productsForPaying.quantityUserWant} onChange={(event) => {

                        /* Calling decreaseOrIncrementQuantity function to modify balance in real time */
                        decreaseOrIncrementQuantity(event)

                        if (event.target.value.length === 0 || event.target.value === "Na") {

                          event.target.value = "1"

                          Object.assign(productsForPaying, {quantityUserWant: event.target.value})

                        }

                        /* If the value of the input is greater than the quantity of the product make the value of the input the same of the quantity */
                        if (Number(event.target.value) > productsForPaying.quantityOfProduct) {

                          event.target.value = productsForPaying.quantityOfProduct

                        }

                        if (Number(event.target.value) < 1) {

                          event.target.value = "1"

                        }

                        /* If the value is not a number put the value 1 in the input */
                        if (isNaN(event.target.value) === true) {

                          event.target.value = "1"

                        }

                        if (event.target.value.includes(".")) {

                          event.target.value = "1"

                        }

                      }}></input>

                      <br></br>

                      {productsInCart.length < 2 ? void (0)

                        :

                        <button onClick={() => setProductsInCart(productsInCart.filter(productToFilter => productToFilter !== productsForPaying))} className="mt-2 border-2 w-[100px] rounded-lg bg-stone-800 duration-500 text-white hover:bg-stone-900">Eliminar</button>}

                    </div>

                    <h2 className="sm:hidden font-bold sm:border-0 sm:border-t-2 sm:mr-0 ml-14 text-lg">US {productsForPaying.priceOfProduct}$</h2>

                  </div>

                )

              })}

              <button className="sm:ml-28 bg-stone-700 duration-200 hover:bg-stone-800 text-white w-[150px] h-[40px] rounded-lg mb-4" onClick={() => location.reload()}>Regresar productos</button>

            </div>

            <div className="bg-white sm:border-2 sm:w-[400px] sm:h-[540px] w-[700px] h-[450px] m-auto rounded-xl duration-500 hover:border-stone-600">

              <h1 className="mt-4 text-xl mb-2">Direccion que va a mandar este producto</h1>

              <input placeholder="Direccion..." className="border-2 rounded-md mb-4 w-[300px] foc duration-500 hover:border-gray-950 border-stone-500" id="direction-input" onChange={eventLocationOfUser}></input>

              <h1 className="text-xl mb-2">Nombre de quien va a recibir el producto</h1>

              <input placeholder="Nombre..." className="border-2 rounded-md mb-4 w-[300px] foc duration-500 hover:border-gray-950 border-stone-500" id="name-input-pay-products" onChange={eventNameOfUser}></input>

              <h1 className="text-xl mb-2">Numero del carnet de quien va a recibir el producto</h1>

              <input placeholder="Numero del carnet..." className="border-2 rounded-md mb-4 w-[300px] foc duration-500 hover:border-gray-950 border-stone-500" id="id-number-input" onChange={eventIdNumberUser}></input>

              <h1 className="text-xl mb-2">Numero telefonico de quien va a recibir el producto</h1>

              <input placeholder="Numero del telefono..." className="border-2 rounded-md mb-4 w-[300px] foc duration-500 hover:border-gray-950 border-stone-500" id="phone-number-input" onChange={eventTelephoneNumberOfUser}></input>

              <br></br>

              {inputsAreEmpty === true && <h1>No haz puesto la informacion necesaria en cada Formulario</h1>}

              <h1 className="font-bold text-2xl">Total: US {totalToPay}$</h1>

              <button className="mb-5 duration-500 mt-3 bg-green-500 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500 text-white font-bold py-2 px-4 rounded" onClick={buy}>Comprar!</button>

            </div>

          </>

          :

          <div className="sm:w-[360px] w-[500px] h-[400px] border-0 top-48 rounded-xl relative shadow-2xl bg-white">

            <h1 className="relative top-28 font-bold text-xl">Su producto esta siendo enviado a su hogar</h1>

            <h1 className="font-bold top-36 relative">Tiempo maximo de entrega 3 dias</h1>

            <button onClick={() => window.location.href = "http://localhost:5173/"} className="mt-[200px] w-[100px] h-[50px] rounded-lg duration-200 hover:bg-stone-900 bg-stone-700 text-white">Ir a inicio</button>

          </div>

        }

      </div>

    </div>

  )

}

export default PayProductsPage