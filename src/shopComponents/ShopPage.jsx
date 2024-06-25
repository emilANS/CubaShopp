import { useEffect, useState, useReducer } from "react"

import axios from "axios"

import { Buffer } from "buffer"

import { IoCart } from "react-icons/io5"

import { VscGraphLine } from "react-icons/vsc"

function ShopPage() {

  /* Here is the port of the server frontend will be connected */
  const portOfServer = "http://localhost:4000/"

  /* UseState for products that are in the database */
  const [products, setProducts] = useState([])

  /* UseState for knowing that the user searched a product and display the button to see products back */
  const [userClickedSearchButton, setUserClickedSearchButton] = useState(false)

  /* UseState for knowing when user is seeing a product in full screen */
  const [isCompleteScreenActivated, setIsCompleteScreenActivated] = useState(false)

  /* UseState to store all the values of the product so user can see it in full screen */
  const [productInFullScreenValues, setProductInFullScreenValues] = useState(null)

  /* UseState for products in the cart */
  const [productsInCart, setProductsInCart] = useState([])

  /* UseState for knowing when the user wants to see the products he have in his cart */
  const [seeProductsInCart, setSeeProductsInCart] = useState(false)

  /* UseState for seeing the filter options of the page like type of product or lowest price */
  const [seeFilterOptions, setSeeFilterOptions] = useState(false)

  /* UseState to put max price of products in filter mode */
  const [priceToFilter, setPriceToFilter] = useState(1)

  /* UseState to store an array of object with all the filter information */
  const [filterInformation, setFilterInformation] = useState([])

  /* UseState for displaying the balance of the products user have in the cart */
  const [balance, setBalance] = useState(0)

  useEffect(() => {

    sessionStorage.setItem("canUserEnterPayProduct", false)

    axios.get(`${portOfServer}get-products-and-show-it`, { params: { hasUserReachFinalPage: false } }).then(res => {

      sessionStorage.setItem("userClickedSubmit", false)

      setProducts(res.data)

    })

  }, [])

  const seeAllProductsAgain = () => {

    axios.get(`${portOfServer}get-products-and-show-it`, { params: { hasUserReachFinalPage: false } }).then(res => {

      setProducts(res.data)

    })

    setUserClickedSearchButton(false)

  }

  window.onscroll = () => {

    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

    if (bottom) {

      let arrayWithAllIds = []

      products.forEach(idOfProducts => {

        arrayWithAllIds.push(idOfProducts.idOfProduct)

      })

      axios.get(`${portOfServer}get-products-and-show-it`, { params: { hasUserReachFinalPage: true, arrayWithAllIds: arrayWithAllIds } }).then(res => {

        res.data.forEach((ignoreThis, index) => {

          setProducts([...products, res.data[index]])

        })

      })

    }

  }

  /* Function to search products user wants to see */
  const searchProducts = () => {

    const typeOfProduct = "Todos los tipos de producto"

    const nameOfProduct = document.getElementById("name-product-user-want-to-search").value

    axios.get(`${portOfServer}get-products-user-want`, { params: { nameOfProduct: nameOfProduct, typeOfProduct: typeOfProduct } }).then(res => {

      setProducts(res.data)

    })

    setUserClickedSearchButton(true)

  }

  const filterProductsByPriceAndCategory = () => {

    axios.get(`${portOfServer}get-products-filtered-by-user`, { params: { filteredPrice: priceToFilter, typeOfProduct: filterInformation.typeOfProduct } }).then(res => {

      setProducts(res.data)

    })

    console.log(filterInformation)

  }

  /* Function to add products to the cart Array */
  const addProductToCart = (product) => {

    let productAlreadyExistInCart = false

    productsInCart.forEach(productForCheckingIfExistsInCart => {

      if (productForCheckingIfExistsInCart.idOfProduct === product.idOfProduct) {

        productAlreadyExistInCart = true

      }

    })

    if (productAlreadyExistInCart === false) {

      const quantityUserWant = Number(document.getElementById(`specify-quantity-of-product-user-want-id:${product.idOfProduct}`).value)

      setProductsInCart([...productsInCart, {
        idOfProduct: product.idOfProduct,
        imageFormattedForBeingDisplayedInFrontend: product.imageFormattedForBeingDisplayedInFrontend,
        nameOfProduct: product.nameOfProduct, priceOfProduct: product.priceOfProduct, quantityUserWant: quantityUserWant,
        quantityOfProduct: product.quantityOfProduct
      }])

      setBalance(balance + quantityUserWant * product.priceOfProduct)

    }

  }

  const buyProducts = () => {

    if (sessionStorage.getItem("isUserLogged") === "true") {

      sessionStorage.setItem("productsInCart", JSON.stringify(productsInCart))

      sessionStorage.setItem("canUserEnterPayProduct", true)

      sessionStorage.setItem("userClickedSubmit", false)

      window.location.replace("/shopPage/payProducts")

    } else {

      sessionStorage.setItem("userHaveToLogin", true)

      window.location.href = "http://localhost:5173/login"

    }

  }

  useEffect(() => {

    /* If balance converts into a negative number convert it to a positive one */
    if (balance < 0) {

      setBalance(Math.abs(balance))
    }

  }, [balance])

  return (

    <div>

      {seeProductsInCart &&

        <div className="z-10 fixed w-80 h-[100%] overflow-y-scroll bg-white border-2 border-stone-700 ">

          <button className="mb-5 duration-500 mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSeeProductsInCart(false)}>Cerrar ventana del carrito</button>

          <hr></hr>

          <h2 className="text-xl font-medium">Balance de tu cuenta {balance}$</h2>

          {productsInCart.length > 0 && <input type="submit" className="mb-5 duration-500 mt-3 bg-yellow-300 hover:shadow-lg hover:shadow-amber-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded" onClick={buyProducts} value={`Pagar ${productsInCart.length > 1 ? "Productos" : "Producto"} y enviar a casa`}></input>}

          <hr></hr>

          <>

            {productsInCart.length === 0 && <h2 >Aun no tienes productos en el carrito</h2>}

            {productsInCart.map(productsInCartElements => {

              const decreaseOrIncrementQuantity = (event) => {

                /* Input Real Time Balance Change */

                /* If the input value is greater than the quantity of the product add the original quantity to the quantity user wants */
                event.target.value > productsInCartElements.quantityOfProduct && [event.target.value = productsInCartElements.quantityOfProduct]

                /* Each result from the for loop to after the for loop sum */
                let eachResultOfCalculationToBeSum = []

                /* Iterate in all elements in the list and then add the values to eachResultOfCalculationToBeSum */
                Array.from(document.querySelectorAll("input[type='text']")).forEach((valueOfQuantityUserWant, index) => {

                  if (valueOfQuantityUserWant.id.includes("specify-quantity-of-product-user-want-id")) {

                    /* Push every result to the list */
                    eachResultOfCalculationToBeSum.push(productsInCart[index].priceOfProduct * parseInt(valueOfQuantityUserWant.value))

                    if (isNaN(parseInt(valueOfQuantityUserWant.value)) === true) {

                      /* If quantityUserWant is NaN update the balance to one that is correct */

                      eachResultOfCalculationToBeSum = []

                      eachResultOfCalculationToBeSum.push(productsInCart[index].priceOfProduct * 1)

                    }

                  }

                })

                /* Put the result on balance by calculating all of their values */
                setBalance(eachResultOfCalculationToBeSum.reduce((x, y) => x + y))

                Object.assign(productsInCartElements, { quantityUserWant: parseInt(event.target.value) })

                /* Button balance change */

                /* When the button Añadir uno (Increase one: in english)... is pressed this if statement will execute to add one more to the balance */
                if (event.target.id.includes("increase")) {

                  setBalance(balance + 1 * productsInCartElements.priceOfProduct)

                  let quantityUserWant = Number(document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value)

                  document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value = quantityUserWant + 1

                  Object.assign(productsInCartElements, { quantityUserWant: document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value })

                }

                /* When the button Quitar uno (decrease one: in english)... is pressed this if statement will execute to rest one more to the balance */
                if (event.target.id.includes("decrease")) {

                  if (event.target.value < 1) {

                    document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value = "1"

                    return

                  }

                  setBalance(balance - 1 * productsInCartElements.priceOfProduct)

                  let quantityUserWant = Number(document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value)

                  document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value = quantityUserWant - 1

                  Object.assign(productsInCartElements, { quantityUserWant: document.getElementById(`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`).value })


                }

              }

              return (

                <div className="border-b-4 rounded-3xl border-stone-400 mb-4" key={`${productsInCartElements.idOfProduct}-cart-list`}>

                  <img className="border-b-2 h-64 object-contain w-[110%] border-stone-400 rounded-lg" src={productsInCartElements.imageFormattedForBeingDisplayedInFrontend}></img>

                  <h3 className="text-lg font-semibold">Nombre del producto</h3>

                  <h2>{productsInCartElements.nameOfProduct}</h2>

                  <h3 className="text-lg font-semibold">Precio del producto</h3>

                  <h2>{productsInCartElements.priceOfProduct}$</h2>

                  <h3 className="text-lg font-semibold">Cantidad que esta en el carrito de este producto</h3>

                  <input className="border-2 rounded-md mb-4 foc duration-500 hover:border-gray-950 border-stone-500" type="text" id={`specify-quantity-of-product-user-want-id:${productsInCartElements.idOfProduct}-cart-list`} defaultValue={productsInCartElements.quantityUserWant}

                    onChange={(event) => {

                      /* Calling decreaseOrIncrementQuantity function to modify balance in real time */
                      decreaseOrIncrementQuantity(event)

                      /* If the value of the input is greater than the quantity of the product make the value of the input the same of the quantity */
                      if (Number(event.target.value) > productsInCartElements.quantityOfProduct) {

                        event.target.value = productsInCartElements.quantityOfProduct

                      }

                      if (Number(event.target.value) < 1) {

                        event.target.value = "1"

                        Object.assign(productsInCartElements, { quantityUserWant: 1 })

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

                  <button className="relative border-2 rounded-lg w-20 h-8 duration-500 hover:bg-gray-950 bg-gray-800 text-white" onClick={decreaseOrIncrementQuantity} id={`increase-${productsInCartElements.idOfProduct}-cart-list`}>Añadir 1</button>

                  <button className="relative border-2 rounded-lg w-20 h-8 duration-500 hover:bg-gray-950 bg-gray-800 text-white" onClick={decreaseOrIncrementQuantity} id={`decrease-${productsInCartElements.idOfProduct}-cart-list`}>Quitar 1</button>

                  {/* Filter elements user want to delete of the cart */}
                  <button className="bg-red-400 duration-300 mb-3 mt-2 hover:text-white hover:bg-red-600 w-60 rounded-lg" onClick={() => setProductsInCart(productsInCart.filter(productInCartToFilter => productInCartToFilter !== productsInCartElements))}>Quitar este producto del carrito</button>

                </div>

              )

            })}

          </>

        </div>

      }


      <div className="z-0 fixed w-[100%] bg-white top-0 left-0">

        {sessionStorage.getItem("isUserLogged") === "true" ? <button onClick={() => [sessionStorage.setItem("isUserLogged", false), window.location.href = "http://localhost:5173/login"]} className="sm:top-2 sm:w-[60px] sm:text-[14px] sm:h-10  bg-stone-800 duration-500 hover:shadow-2xl hover:shadow-stone-800 hover:text-white hover:bg-stone-950 h-9 w-32 text-white rounded-md absolute top-4 left-[80%]">Cerrar Sesion</button>

          :

          <>

            <button className="sm:w-[70px] sm:h-[40px] sm:text-[13px] sm:mr-2 bg-stone-800 duration-500 hover:shadow-2xl hover:shadow-stone-800 hover:text-white hover:bg-stone-950 h-9 w-32 text-white rounded-md absolute top-4 right-0" onClick={() => window.location.href = "http://localhost:5173/register"}>Crear cuenta!</button>

            <button className="sm:right-0 sm:mr-2 sm:w-[70px] font-medium text-[14px] sm:h-[40px] sm:top-16 bg-stone-300 duration-500 hover:shadow-2xl hover:shadow-stone-800 hover:text-white hover:bg-stone-500 h-9 w-32 rounded-md absolute top-4 right-36" onClick={() => window.location.href = "http://localhost:5173/login"}>Iniciar Sesion</button>

          </>

        }


        {sessionStorage.getItem("isUserLogged") === "true" && <VscGraphLine onClick={() => window.location.href = "http://localhost:5173/statisticsOfUser"} className="sm:top-14 sm:left-2 absolute duration-500 hover:text-gray-600 cursor-pointer left-24 top-3 size-10" />}

        <div className="flex">

          <IoCart className="sm:left-1 top-2 absolute duration-500 hover:text-gray-600 cursor-pointer left-6 size-10" onClick={() => setSeeProductsInCart(true)} />

          {isCompleteScreenActivated === false && <h2 onClick={() => setSeeFilterOptions(true)} className="hover:cursor-pointer ml-[140px] absolute mt-4 text-blue-800 text-lg">Filtros</h2>}

        </div>

        <input className="sm:w-44 border-solid mt-2 h-10 w-1/2 rounded-md border-2 border-stone-700" type="text" placeholder="Que buscas?" id="name-product-user-want-to-search"></input>

        <button className="sm:ml-auto sm:mr-auto sm:block sm:left-[0px] sm:mt-4 sm:w-20 relative right-24 bottom-0.5 border-2 rounded-lg w-20 h-8 duration-500 hover:bg-gray-950 bg-gray-800 text-white" onClick={searchProducts}>Buscar</button>

        {userClickedSearchButton && <><br></br> <button onClick={seeAllProductsAgain} className="bg-gray-700 rounded-md w-[200px] h-[30px] duration-500 hover:bg-gray-900 text-white mt-4 sm:mt-1 md:mr-[67px]">Ver todos los productos</button></>}

        <hr className="border-stone-500 mt-3"></hr>

      </div>


      <div className="grid sm:gap-0 grid-cols-3 justify-center mt-16 sm:grid-cols-1">

        {isCompleteScreenActivated === false ?

          products.map(productElements => {

            /* Assigning image url and limit it to repeat the process */
            if (productElements.imageIsReady === undefined && productElements.imageOfProductFrontendVersion === undefined) {

              for (let index = 0; index < products.length; index++) {

                Object.assign(productElements, { imageIsReady: true, imageFormattedForBeingDisplayedInFrontend: `data:image/jpeg;base64, ${Buffer.from(productElements.imageOfProduct.data).toString("base64")}` })

              }

            }


            return (

              <>

                <div className="border-2 w-72 m-12 rounded-2xl duration-500 hover:shadow-slate-700 shadow-xl" key={productElements.idOfProduct}>

                  <img className="w-[110%] object-contain h-72 rounded-2xl border-b-4" src={productElements.imageFormattedForBeingDisplayedInFrontend}></img>

                  <h3 className="text-2xl" onClick={() => { [setProductInFullScreenValues([productElements]), setIsCompleteScreenActivated(true)] }}>{productElements.nameOfProduct}</h3>

                  <h2 className="text-xl">{productElements.priceOfProduct}$</h2>

                  <div>

                    <input className="border-2 rounded-md mb-4 foc duration-500 hover:border-gray-950 border-stone-500" defaultValue="1" id={`specify-quantity-of-product-user-want-id:${productElements.idOfProduct}`} onChange={(event) => {

                      /* If the value of the input is greater than the quantity of the product make the value of the input the same of the quantity */
                      if (Number(event.target.value) > productElements.quantityOfProduct) {

                        event.target.value = productElements.quantityOfProduct

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


                    <button className="mb-5 duration-500 bg-stone-700 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded" onClick={() => addProductToCart(productElements)}>Añadir al carrito</button>

                  </div>


                </div>

              </>

            )

          })


          : /* Double dot to continue ternary operator */


          productInFullScreenValues.map(productInFullScreenElements => {

            return (

              <div className="-z-10 absolute w-[60%] h-auto m-auto right-0 left-0 bottom-0 top-0">

                <img className="shadow-[0_-30px_100px_-40px_rgba(0,0,0,0.3)] border-2 h-[600px] object-contain w-[110%] border-stone-400 rounded-3xl" src={productInFullScreenElements.imageFormattedForBeingDisplayedInFrontend}></img>

                <div className="hover:shadow-2xl duration-200 shadow-xl border-2 border-stone-400 rounded-xl border-t-0">

                  <h2 className="mb-2 mt-2 text-4xl">{productInFullScreenElements.nameOfProduct}</h2>

                  <hr className="bg-stone-600 h-[2px]"></hr>

                  <h2 className="mt-4 text-xl font-medium">Descripcion:</h2>

                  <h2 className="text-2xl font-medium text-blue-700">{productInFullScreenElements.descriptionOfProduct}</h2>

                  <h1 className="text-4xl mt-3">Precio del producto</h1>

                  <h2 className="text-4xl mt-2 mb-4">{productInFullScreenElements.priceOfProduct}$</h2>


                  <input className="border-2 rounded-md mb-4 foc duration-500 hover:border-gray-950 border-stone-500" defaultValue="1" id={`specify-quantity-of-product-user-want-id:${productInFullScreenElements.idOfProduct}`} placeholder="1" onChange={(event) => {

                    /* If the value of the input is greater than the quantity of the product make the value of the input the same of the quantity */
                    if (Number(event.target.value) > productInFullScreenElements.quantityOfProduct) {

                      event.target.value = productInFullScreenElements.quantityOfProduct

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

                  <button className="mb-5 duration-500 bg-stone-700 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded" onClick={() => addProductToCart(productInFullScreenElements)}>Añadir al carrito</button>

                  <br></br>

                  <button className="overflow-auto right-52 text-white w-20 h-14 bg-red-500 hover:bg-red-600 rounded-md duration-500" onClick={() => setIsCompleteScreenActivated(false)}>Ir atras</button>

                </div>

              </div>

            )

          })

        }

        {seeFilterOptions &&


          <div className="overflow-y-scroll bg-white border-t-2 border-stone-400 w-[100%] h-[20%] fixed bottom-0">

            <h1 className="mb-2 font-bold">Opciones de Filtros</h1>

            <h1 className="font-medium">Tipos de producto:</h1>

            <div onClick={(event) => {

              if (event.target.id === "submit-filter-button") {

                filterProductsByPriceAndCategory()

                setUserClickedSearchButton(true)

              }

              if (event.target.id !== undefined && event.target.id !== "submit-filter-button" && event.target.id !== "range-input") {

                setFilterInformation(Object.assign(filterInformation, { typeOfProduct: event.target.id }))

              }

              if (event.target.id === "range-input") {

                Object.assign(filterInformation, { filteredPrice: event.target.value * 10 })

              }

            }}>

              <button id="Ninguno" className="sm:mt-2 mr-4 p-2 bg-gray-300 w-auto rounded-lg">Ninguno</button>

              <button id="Tecnologia" className="sm:mt-2 mr-4 p-2 bg-gray-300 w-auto rounded-lg">Tecnologia</button>

              <button id="Herramientas" className="sm:mt-2 mr-4 p-2 bg-gray-300 w-auto rounded-lg">Herramientas</button>

              <button id="Comida" className="sm:mt-2 mr-4 p-2 bg-gray-300 w-auto rounded-lg">Comida</button>

              <button id="Ropa" className="sm:mt-2 mr-4 p-2 bg-gray-300 w-auto rounded-lg">Ropa</button>

              <button id="Electrodomesticos" className="sm:mt-2 mr-4 p-2 bg-gray-300 w-auto rounded-lg">Electrodomesticos</button>


              <h1 className="mb-2 mt-2 font-bold">Filtrar por precios:</h1>

              <h2 className="font-medium">{priceToFilter}$</h2>

              <input onChange={(event) => {

                setPriceToFilter(event.target.value * 10)

              }} defaultValue={1} id="range-input" type="range"></input>

              <button id="submit-filter-button" className="ml-8 mb-2 duration-500 hover:bg-gray-200 border-2 border-gray-600 rounded-lg w-9">Ir</button>

            </div>

          </div>

        }

      </div>

    </div>

  )

}

export default ShopPage
