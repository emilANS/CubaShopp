import React, { useEffect, useState, useReducer } from "react"

import { v4 as uuidv4 } from "uuid"

import axios from "axios"

import { Buffer } from "buffer"

function AdminPage() {

  /* Here is the port of the server frontend will be connected */
  const portOfServer = "http://localhost:4000/"

  /* UseState to represent the existing Products */
  const [existingProducts, setExistingProducts] = useState([])

  /* UseState for knowing that the user searched a product and display the button to see products back */
  const [userClickedSearchButton, setUserClickedSearchButton] = useState(false)

  /* UseStates to create new products */
  const [nameOfProduct, setNameOfProduct] = useState("")

  const [descriptionOfProduct, setDescriptionOfProduct] = useState("")

  const [quantityOfProduct, setQuantityOfProduct] = useState("")

  const [priceOfProduct, setPriceOfProduct] = useState("")

  /* Image useStates */
  const [showNewProductImage, setShowNewProductImage] = useState(null)

  const [changeProductImage, setChangeProductImage] = useState(null)

  /* UseReducer for updating page when is necessary */
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  /* Warnings for admin */
  const [waitUntilImageUploads, setWaitUntilImageUploads] = useState(false)

  const [inputsAreEmpty, setInputsAreEmpty] = useState(false)

  const [timesAdminIsEditing, setTimesAdminIsEditing] = useState(0)

  /* Creating events to every useState that needs it */

  /* Event for images */
  const onImageChange = (event) => {

    if (event.target.files.length === 0) {

      setShowNewProductImage(null)

    }

    // Image upload function
    if (event.target.files && event.target.files[0]) {

      setShowNewProductImage(URL.createObjectURL(event.target.files[0]))

    }

  }

  const onChangeProductImage = (event) => {

    if (event.target.files.length === 0) {

      setChangeProductImage(null)

    }

    // Image upload function
    if (event.target.files && event.target.files[0]) {

      setChangeProductImage(URL.createObjectURL(event.target.files[0]))

    }

  }

  const nameOfProductEvent = (event) => {
    setNameOfProduct(event.target.value)
  }

  const descriptionOfProductEvent = (event) => {
    setDescriptionOfProduct(event.target.value)
  }

  const quantityOfProductEvent = (event) => {
    setQuantityOfProduct(event.target.value)
  }

  const priceOfProductEvent = (event) => {
    setPriceOfProduct(event.target.value)
  }

  /* Get existing products from database */
  useEffect(() => {

    /* Get the permission to receive notifications of when a products is being delivered */
    Notification.requestPermission()

    axios.get(`${portOfServer}get-products-and-show-it`, { params: { hasUserReachFinalPage: false } }).then(res => {

      setExistingProducts(res.data)

    })

  }, [])

  window.onscroll = () => {

    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

    if (bottom && userClickedSearchButton === false) {

      let arrayWithAllIds = []

      existingProducts.forEach(idOfProducts => {

        arrayWithAllIds.push(idOfProducts.idOfProduct)

      })

      axios.get(`${portOfServer}get-products-and-show-it`, { params: { hasUserReachFinalPage: true, arrayWithAllIds: arrayWithAllIds, typeOfProduct: "Todos los tipos de producto" } }).then(res => {

        res.data.forEach((ignoreThis, index) => {

          setExistingProducts([...existingProducts, res.data[index]])

        })

      })

    }

  }

  /* Function to search products Admin wants to see */
  const searchProducts = () => {

    const typeOfProduct = "Todos los tipos de producto"

    const nameOfProduct = document.getElementById("name-product-user-want-to-search").value

    console.log(nameOfProduct)

    axios.get(`${portOfServer}get-products-user-want`, { params: { nameOfProduct: nameOfProduct, typeOfProduct: typeOfProduct } }).then(res => {

      console.log(res)

      setExistingProducts(res.data)

    })

    setUserClickedSearchButton(true)

  }

  const seeAllProductsAgain = () => {

    axios.get(`${portOfServer}get-products-and-show-it`, { params: { hasUserReachFinalPage: false } }).then(res => {

      setExistingProducts(res.data)

    })

    setUserClickedSearchButton(false)

  }

  /* Add products when button is clicked to existingProducts and send it to database */
  const handleSubmit = () => {

    if (document.getElementById("name-of-product-admin-mode").value === "" || document.getElementById("description-of-product-admin-mode").value === ""
      || document.getElementById("quantity-of-product-admin-mode").value === "" || document.getElementById("price-of-product-admin-mode").value === ""
      || document.getElementById("type-of-product").value === "Ninguno" || showNewProductImage === null
      /* || document.getElementById("type-of-product").value === "" */) {

      setInputsAreEmpty(true)

      return

    }

    setWaitUntilImageUploads(true)

    document.getElementById("add-products-button").setAttribute("hidden", "true")

    let newIdForProduct = uuidv4()

    setExistingProducts([...existingProducts, { idOfProduct: newIdForProduct, imageOfProductFrontendVersion: showNewProductImage, nameOfProduct: nameOfProduct, descriptionOfProduct: descriptionOfProduct, quantityOfProduct: quantityOfProduct, priceOfProduct, priceOfProduct }])

    axios.get(`${portOfServer}add-products-to-database`, { params: { idOfProduct: newIdForProduct, nameOfProduct: nameOfProduct, descriptionOfProduct: descriptionOfProduct, quantityOfProduct: quantityOfProduct, priceOfProduct, priceOfProduct, typeOfProduct: document.getElementById("type-of-product").value } })

    setTimeout(() => {

      setWaitUntilImageUploads(false)

      document.getElementById("add-products-button").removeAttribute("hidden", "false")

      setShowNewProductImage(null)

    }, "2500")

    setInputsAreEmpty(false)

    console.log("EXECUTED")

    document.getElementById("name-of-product-admin-mode").value = ""

    document.getElementById("description-of-product-admin-mode").value = ""

    document.getElementById("quantity-of-product-admin-mode").value = ""

    document.getElementById("price-of-product-admin-mode").value = ""

  }

  return (

    <>

      <button className="mb-5 mt-2 sm:mr-0 mr-8 duration-500 bg-stone-700 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = "http://localhost:5173/AdminPage1/DeliveryPage"}>Ir a envios que se estan haciendo</button>

      <button className="mb-5 duration-500 bg-stone-700 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = "http://localhost:5173/AdminPage1/StatisticsPage"}>Ir a estadisticas</button>

      <img className="sm:w-[50%] sm:h-[50%] w-[20%] h-[50%] m-auto top-0 bottom-0 right-0 left-0" src={showNewProductImage}></img>

      <h1 className="text-xl">Selecciona una imagen</h1>

      <form id="buttonForm" action="http://localhost:4000/upload-image-to-product" method="post" encType="multipart/form-data">

        <input className="mb-4" onChange={onImageChange} type="file" name="imageFileOfProduct" />

      </form>

      <input className="mr-4 border-solid h-10 w-80 rounded-md border-2 border-stone-700" id="name-of-product-admin-mode" onBlur={nameOfProductEvent} placeholder="nombre del producto"></input>

      <input className="mr-4 border-solid h-10 w-80 rounded-md border-2 border-stone-700" id="description-of-product-admin-mode" onBlur={descriptionOfProductEvent} placeholder="descripcion del producto"></input>

      <input className="mr-4 mb-4 border-solid h-10 w-80 rounded-md border-2 border-stone-700" id="quantity-of-product-admin-mode" type="number" onBlur={quantityOfProductEvent} placeholder="cantidad del producto"></input>

      <input className="mb-4 mr-4 border-solid h-10 w-80 rounded-md border-2 border-stone-700" id="price-of-product-admin-mode" type="number" onBlur={priceOfProductEvent} placeholder="precio del producto"></input>

      <br></br>

      <h3>Elegir tipo de producto:</h3>

      <select className="mb-8 duration-500 hover:bg-gray-700 bg-gray-500 rounded-md text-white h-10" id="type-of-product">

        <option>Ninguno</option>

        <option>Tecnologia</option>

        <option>Herramientas</option>

        <option>Comida</option>

        <option>Ropa</option>

        <option>Electrodomesticos</option>

      </select>

      <br></br>

      {waitUntilImageUploads === true && <h2>Subiendo nuevas propiedades...</h2>}

      <input className="relative border-2 mb-6 rounded-lg w-60 h-8 duration-500 hover:bg-green-500 bg-green-400 text-white" id="add-products-button" form="buttonForm" type="submit" onClick={handleSubmit} value="Añadir Producto!"></input>

      {inputsAreEmpty && <h1>No haz completado todos o algun formulario</h1>}

      <br></br>

      <input placeholder="Que buscas?" type="text" className="border-solid h-10 w-1/2 rounded-md border-2 border-stone-700" id="name-product-user-want-to-search"></input>

      <br></br>

      <button className="mt-4 relative border-2 rounded-lg w-20 h-8 duration-500 hover:bg-gray-950 bg-gray-800 text-white" onClick={searchProducts}>Buscar</button>

      {userClickedSearchButton && <><br></br> <button onClick={seeAllProductsAgain} className="bg-gray-700 rounded-md w-[200px] h-[30px] duration-500 hover:bg-gray-900 text-white mt-4 sm:mt-1">Ver todos los productos</button></>}

      <hr></hr>

      <div className="sm:block grid grid-cols-3 justify-center">

        {existingProducts.map(productElements => {

          /* Assigning image url and limit it to repeat the process */
          if (productElements.imageIsReady === undefined && productElements.imageOfProductFrontendVersion === undefined) {

            for (let index = 0; index < existingProducts.length; index++) {

              Object.assign(productElements, { imageIsReady: true, imageFormattedForBeingDisplayedInFrontend: `data:image/jpeg;base64, ${Buffer.from(productElements.imageOfProduct.data).toString("base64")}` })

            }

          }

          /* Save new properties of the product when admin enters in edit mode */
          const saveNewPropertiesOfProduct = (event) => {

            setWaitUntilImageUploads(true)

            if (changeProductImage === null) {

              event.preventDefault()

            }

            /* All of this getElementById are for Hiding the inputs or buttons so the image is no lost */
            document.getElementById("save-new-properties-button").setAttribute("hidden", "true")

            document.getElementById("image-change-input").setAttribute("hidden", "true")

            document.getElementById("delete-product-button").setAttribute("hidden", "true")

            setTimeout(() => {

              /* All of this getElementById is for showing back the inputs and buttons */
              document.getElementById("save-new-properties-button").removeAttribute("hidden", "false")

              document.getElementById("image-change-input").removeAttribute("hidden", "false")

              document.getElementById("delete-product-button").removeAttribute("hidden", "false")

              /* If the image was changed proceed and put the new image in the product... if image wasn't changed don't change anything  */
              if (changeProductImage !== null) {

                Object.assign(productElements, { waitUntilImageIsUploaded: false, imageFormattedForBeingDisplayedInFrontend: undefined, imageOfProductFrontendVersion: changeProductImage, nameOfProduct: document.getElementById("input-new-name-product").value, descriptionOfProduct: document.getElementById("input-new-description-product").value, priceOfProduct: document.getElementById("input-new-price-product").value, quantityOfProduct: document.getElementById("input-new-quantity-product").value, productIsInEditMode: false })

              } else {

                Object.assign(productElements, { waitUntilImageIsUploaded: false, nameOfProduct: document.getElementById("input-new-name-product").value, descriptionOfProduct: document.getElementById("input-new-description-product").value, priceOfProduct: document.getElementById("input-new-price-product").value, quantityOfProduct: document.getElementById("input-new-quantity-product").value, productIsInEditMode: false })

              }

              axios.get(`${portOfServer}edit-products-information`, { params: { idOfProduct: productElements.idOfProduct, nameOfProduct: productElements.nameOfProduct, descriptionOfProduct: productElements.descriptionOfProduct, priceOfProduct: productElements.priceOfProduct, quantityOfProduct: productElements.quantityOfProduct, } })

              forceUpdate()

              setWaitUntilImageUploads(false)

              setChangeProductImage(null)

            }, "2500")

            setTimesAdminIsEditing(0)

          }

          const declineNewProperties = () => {

            Object.assign(productElements, { productIsInEditMode: false })

            forceUpdate()

            setTimesAdminIsEditing(0)

          }

          const editProduct = () => {

            setTimesAdminIsEditing(timesAdminIsEditing + 1)

            if (timesAdminIsEditing <= 0) {

              Object.assign(productElements, { productIsInEditMode: true });

              forceUpdate()

            }

            console.log(timesAdminIsEditing)

          }

          /* Function to delete products from the existingProducts Array */
          const deleteProduct = () => {

            const confirmIfAdminWantsToDeleteProduct = confirm("Estas seguro que quieres borrar este producto!?")

            if (confirmIfAdminWantsToDeleteProduct === true) {

              setExistingProducts(existingProducts.filter(productToFilter => productToFilter !== productElements))

              axios.get(`${portOfServer}delete-product`, { params: { idOfProduct: productElements.idOfProduct } })

            }

          }

          /* Returning html tags to frontend */
          return (

            <div className="border-2 w-72 m-12 rounded-2xl duration-500 hover:shadow-slate-700 shadow-xl" key={`${productElements.idOfProduct}`}>

              <img className="w-[110%] object-contain h-72 rounded-2xl border-b-4" src={productElements.imageFormattedForBeingDisplayedInFrontend === undefined ? productElements.imageOfProductFrontendVersion : productElements.imageFormattedForBeingDisplayedInFrontend}></img>

              {productElements.productIsInEditMode !== true ?

                <div>

                  <h3 className="text-2xl">Nombre del producto</h3>

                  <h2 className="text-information-admin-products">{productElements.nameOfProduct}</h2>

                  <hr></hr>

                  <h3 className="text-2xl">Precio del producto</h3>

                  <h2 className="text-information-admin-products">{productElements.priceOfProduct}$</h2>

                  <hr></hr>

                  <h2 className="text-2xl">Descripcion del producto</h2>

                  <h2 className="text-information-admin-products">{productElements.descriptionOfProduct}</h2>

                  <hr></hr>

                  <h3 className="text-2xl">Cantidad del producto</h3>

                  <h2 className="text-information-admin-products">{productElements.quantityOfProduct}</h2>

                  <hr></hr>

                  {waitUntilImageUploads !== true ? <button className="mb-5 mt-4 duration-500 bg-stone-700 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded" onClick={editProduct}>Editar Producto</button> : <h2>Subiendo nuevas propiedades...</h2>}


                </div>

                : /* Here the ternary operator continues */

                <div>

                  <h3 className="title-information-admin-products">Nombre del producto</h3>

                  <input className="border-solid w-56 rounded-md border-2 border-stone-700" id="input-new-name-product" placeholder="nuevo nombre del producto" defaultValue={productElements.nameOfProduct}></input>

                  <h3 className="title-information-admin-products">Precio del producto</h3>

                  <input className="border-solid w-56 rounded-md border-2 border-stone-700" id="input-new-price-product" placeholder="nuevo precio del producto" defaultValue={productElements.priceOfProduct}></input>

                  <h3 className="title-information-admin-products">Cantidad del producto</h3>

                  <input className="border-solid w-56 rounded-md border-2 border-stone-700" id="input-new-quantity-product" placeholder="nueva cantidad del producto" defaultValue={productElements.quantityOfProduct}></input>

                  <h3 className="title-information-admin-products">Descripcion del producto</h3>

                  <input className="border-solid w-56 rounded-md border-2 border-stone-700" id="input-new-description-product" placeholder="nueva descripcion del producto" defaultValue={productElements.quantityOfProduct}></input>

                  <form id="editProductsButtonForm" action="http://localhost:4000/upload-image-to-product" method="post" encType="multipart/form-data">

                    <input id="image-change-input" onChange={onChangeProductImage} type="file" name="imageFileOfProduct" />

                  </form>

                  {waitUntilImageUploads ? <h2>Subiendo nuevas propiedades...</h2> : <button className="bg-yellow-400 duration-300 mb-3 mt-2 hover:bg-yellow-500 w-60 rounded-lg" onClick={declineNewProperties}>No guardar cambios</button>}

                  <br></br>

                  <input className="relative border-2 rounded-lg w-60 h-8 duration-500 hover:bg-green-500 bg-green-400 text-white" id="save-new-properties-button" form="editProductsButtonForm" type="submit" onClick={saveNewPropertiesOfProduct} value="Guardar nuevas propiedades"></input>

                  <br></br>

                  <button className="bg-red-400 duration-300 mb-3 mt-2 hover:text-white hover:bg-red-600 w-60 rounded-lg" onClick={deleteProduct} id="delete-product-button">Borrar producto</button>

                </div>

              }

            </div>

          )

        })}

      </div>

    </>

  )

}

export default AdminPage
