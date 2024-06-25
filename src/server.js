// Configurations for server
import express from "express"

import sqlite3 from "sqlite3"

import fileUpload from "express-fileupload"

import cors from "cors"

const app = express();

import { urlencoded, json } from 'express';

import http from "http"

import { v4 as uuidv4 } from "uuid"

app.use(json({ limit: "200mb" }));

app.use(urlencoded({ extended: true, limit: "200mb" }));

app.use(cors())

app.use(fileUpload())

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

const port = 4000

const server = http.createServer(app)

server.listen(port, () => console.log(`server is running in port ${port}`))

const db = new sqlite3.Database("./sqlFolder/databaseOfTheShop.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message)
})

/* Get credentials of the user and check it if they are incorrect or correct */
app.get("/get-credentials-to-login-user", (req, res) => {

  const userName = req.query.userName

  const password = req.query.password

  const email = req.query.email

  db.all(`SELECT * FROM users WHERE userName == (?) AND password == (?) AND email == (?)`, [userName, password, email], (err, rows) => {

    if (rows.length !== 0) {

      rows.forEach(row => {

        if (row.isUserAdmin === 1) {

          res.send({ status: "credentialsAreCorrectADMIN" })

        } else {

          res.send({ status: "credentialsAreCorrect", id: row.id })

        }

      })


    } else {

      res.send("credentialsAreIncorrect")

    }

  })

})

/* Function to register user in the backend */
app.get("/insert-credentials-to-database", (req, res) => {

  const userName = req.query.userName

  const password = req.query.password

  const email = req.query.email

  const telephoneNumber = req.query.telephoneNumber

  let isEmailValid = false

  function validateEmail() {

    if (email.endsWith("@yahoo-inc.com") || email.endsWith("@gmail.com")) {

      isEmailValid = true

    } else {

      isEmailValid = false

    }

  }

  validateEmail()

  let usernameAlreadyTaken = false

  let emailAlreadyTaken = false

  db.all(`SELECT userName FROM users WHERE userName == (?)`, [userName], (err, rows) => {

    if (rows.length !== 0) {

      usernameAlreadyTaken = true

    }

  })

  db.all(`SELECT email FROM users WHERE email == (?)`, [email], (err, rows) => {

    if (rows.length !== 0) {

      emailAlreadyTaken = true

    }

  })

  let arrayWithAllMistakesFromUser = []

  setTimeout(() => {

    let specialCharactersRegex = /^[\w\s]*$/

    if (specialCharactersRegex.test(password) === false && isEmailValid === true && password.length >= 7 && usernameAlreadyTaken === false && emailAlreadyTaken === false) {

      db.run(`INSERT INTO users (id, userName, password, email, telephoneNumber, isUserAdmin) VALUES (?,?,?,?,?,?)`, [uuidv4(), userName, password, email, telephoneNumber, 0])

      arrayWithAllMistakesFromUser.push("USER PUT CORRECT CREDENTIALS")

    }

    if (usernameAlreadyTaken === true) {

      arrayWithAllMistakesFromUser.push("USERNAME ALREADY TAKEN")

    }

    if (emailAlreadyTaken === true) {

      arrayWithAllMistakesFromUser.push("EMAIL ALREADY TAKEN")

    }

    if (specialCharactersRegex.test(password) === true || !password.length >= 7) {

      arrayWithAllMistakesFromUser.push("INVALID PASSWORD")

    }

    if (isEmailValid === false) {

      arrayWithAllMistakesFromUser.push("INVALID EMAIL")

    }

    if (telephoneNumber.length === 0) {

      arrayWithAllMistakesFromUser.push("INVALID TELEPHONE NUMBER")

    }

    res.send(arrayWithAllMistakesFromUser)

  }, "2000")

})

let idOfProductToAddImage = null

/* Adding products part (THIS PART IS THE ADMIN SECTION) */
app.get("/add-products-to-database", (req, res) => {

  const nameOfProduct = req.query.nameOfProduct

  const descriptionOfProduct = req.query.descriptionOfProduct

  const quantityOfProduct = req.query.quantityOfProduct

  const priceOfProduct = req.query.priceOfProduct

  const typeOfProduct = req.query.typeOfProduct

  const idOfProduct = req.query.idOfProduct

  /* Adding the same id to the variable so it can add a image */
  idOfProductToAddImage = idOfProduct

  /* Insert into backend the products information */
  db.run(`INSERT INTO products (idOfProduct, nameOfProduct, descriptionOfProduct, quantityOfProduct, priceOfProduct, typeOfProduct) VALUES (?,?,?,?,?,?)`, [idOfProduct, nameOfProduct, descriptionOfProduct, quantityOfProduct, priceOfProduct, typeOfProduct])

  res.sendStatus(200)

})

/* Editing products and send new values to the database */
app.get("/edit-products-information", (req, res) => {

  const nameOfProduct = req.query.nameOfProduct

  const descriptionOfProduct = req.query.descriptionOfProduct

  const priceOfProduct = req.query.priceOfProduct

  const quantityOfProduct = req.query.quantityOfProduct

  const idOfProduct = req.query.idOfProduct

  idOfProductToAddImage = idOfProduct

  db.run(`UPDATE products SET nameOfProduct = (?), descriptionOfProduct = (?), priceOfProduct = (?), quantityOfProduct == (?) WHERE idOfProduct == (?)`, [nameOfProduct, descriptionOfProduct, priceOfProduct, quantityOfProduct, idOfProduct])

})

/* Add an image to the product */
app.post("/upload-image-to-product", (req, res) => {

  if (req.files !== null) {

    const nameOfImage = req.files.imageFileOfProduct.name

    const contentOfImage = req.files.imageFileOfProduct.data

    setTimeout(() => {

      db.run(`UPDATE products SET imageNameOfProduct = (?), imageOfProduct = (?) WHERE idOfProduct == (?)`, [nameOfImage, contentOfImage, idOfProductToAddImage])

    }, "2000")

    res.sendStatus(204)

  } else {

    res.sendStatus(204)

  }

})

/* Show in frontend the products that already exists */
app.get("/get-products-and-show-it", (req, res) => {

  /* See if user reached the bottom of the page */
  const hasUserReachFinalPage = req.query.hasUserReachFinalPage

  /* Get all ids of the product so they don't repeat */
  const arrayWithAllIds = req.query.arrayWithAllIds

  /* Get type of product user is searching */
  const typeOfProduct = req.query.typeOfProduct

  /* If user didn't have reached the bottom Select normally */
  if (hasUserReachFinalPage === "false") {

    db.all(`SELECT * FROM products LIMIT 10`, (err, rows) => {

      res.send(rows)

    })

    /* Else Select every product minus the one that are already in the page */
  } else if (typeOfProduct === "Todos los tipos de producto") {

    let sqlQueryWithAllIds = ["SELECT * FROM products WHERE"]

    for (let index = 0; index < arrayWithAllIds.length; index++) {

      index === 0 ? sqlQueryWithAllIds.push(`idOfProduct != ("${arrayWithAllIds[index]}")`) : sqlQueryWithAllIds.push(`AND idOfProduct != ("${arrayWithAllIds[index]}")`)

    }

    sqlQueryWithAllIds.push("LIMIT 10")

    db.all(sqlQueryWithAllIds.join(" "), (err, rows) => {

      res.send(rows)

    })

    /* Selects all products without the id of others product that are being displayed so it don't repeat */
  } else {

    let sqlQueryWithAllIds = ["SELECT * FROM products WHERE typeOfProduct == (?)"]

    for (let index = 0; index < arrayWithAllIds.length; index++) {

      index === 0 ? sqlQueryWithAllIds.push(`idOfProduct != ("${arrayWithAllIds[index]}")`) : sqlQueryWithAllIds.push(`AND idOfProduct != ("${arrayWithAllIds[index]}")`)

    }

    sqlQueryWithAllIds.push("LIMIT 10")

    db.all(sqlQueryWithAllIds.join(" "), [typeOfProduct], (err, rows) => {

      res.send(rows)

    })

  }

})

app.get("/get-products-filtered-by-user", (req, res) => {

  const typeOfProduct = req.query.typeOfProduct

  const filteredPrice = req.query.filteredPrice

  console.log(filteredPrice, typeOfProduct)

  if (typeOfProduct === "Ninguno") {

    db.all(`SELECT * FROM products WHERE priceOfProduct <= (?)`, [filteredPrice], (err, rows) => {

      res.send(rows)

    })

  } else {

    db.all(`SELECT * FROM products WHERE priceOfProduct <= (?) AND typeOfProduct == (?)`, [filteredPrice, typeOfProduct], (err, rows) => {

      res.send(rows)

      console.log(rows)

    })

  }

})

/* Get products from database that user search for */
app.get("/get-products-user-want", (req, res) => {

  const typeOfProduct = req.query.typeOfProduct

  const nameOfProduct = req.query.nameOfProduct

  /* If searched Products are of all types search all of them */
  if (typeOfProduct === "Todos los tipos de producto") {

    db.all(`SELECT * FROM products WHERE nameOfProduct LIKE '%' || ? || '%' OR descriptionOfProduct LIKE '%' || ? || '%' LIMIT 10`, [nameOfProduct, nameOfProduct], (err, rows) => {

      res.send(rows)

    })

    /* If search input is empty select all of the type of product */
  } else if (nameOfProduct === "") {

    db.all(`SELECT * FROM products WHERE typeOfProduct == (?) LIMIT 10`, [typeOfProduct], (err, rows) => {

      res.send(rows)

    })

    /* If no one of the others behind execute select from the type and the name */
  } else {

    db.all(`SELECT * FROM products WHERE typeOfProduct == (?) AND nameOfProduct LIKE '%' || ? || '%' OR descriptionOfProduct LIKE '%' || ? || '%' LIMIT 10`, [typeOfProduct, nameOfProduct, nameOfProduct], (err, rows) => {

      res.send(rows)

    })

  }

})

/* Delete product from database */
app.get("/delete-product", (req, res) => {

  const idOfProduct = req.query.idOfProduct

  db.run(`DELETE FROM products WHERE idOfProduct == (?)`, [idOfProduct])

})

/* Send information about products to delivery */
app.get("/send-products-to-delivery", (req, res) => {

  const locationOfUser = req.query.locationOfUser

  const nameOfUser = req.query.nameOfUser

  const idNumberUser = req.query.idNumberUser

  const telephoneNumberOfUser = req.query.telephoneNumberOfUser

  const totalPrice = req.query.totalPrice

  const products = req.query.products

  const idOfUser = req.query.idOfUser

  let arrayWithIds = []

  let arrayWithNames = []

  let arrayWithQuantity = []

  products.forEach(extractProducts => {

    db.all(`SELECT quantityOfProduct FROM products WHERE idOfProduct == (?)`, [extractProducts.idOfProduct], (err, rows) => {

      rows.forEach(row => {

        /* In the case that the product will end his quantity delete the product from the database */
        if (row.quantityOfProduct <= extractProducts.quantityUserWant) {

          db.all(`SELECT * FROM products WHERE idOfProduct == (?)`, [extractProducts.idOfProduct], (err, rows) => {

            rows.forEach(row => {

              db.run(`INSERT INTO specialProductsCases (idOfProduct, nameOfProduct, descriptionOfProduct, quantityOfProduct, priceOfProduct, imageNameOfProduct, imageOfProduct, typeOfProduct, idOfUser) VALUES (?,?,?,?,?,?,?,?,?)`,
                [row.idOfProduct, row.nameOfProduct, row.descriptionOfProduct, row.quantityOfProduct, row.priceOfProduct, row.imageNameOfProduct, row.imageOfProduct, row.typeOfProduct, idOfUser])

            })

          })

          db.run(`DELETE FROM products WHERE idOfProduct == (?)`, [extractProducts.idOfProduct])

        } else {

          /* In the case the quantity user want in less than the quantity product have rest quantity form database */
          db.run(`UPDATE products SET quantityOfProduct = (?) WHERE idOfProduct == (?)`, [parseInt(row.quantityOfProduct) - parseInt(extractProducts.quantityUserWant), extractProducts.idOfProduct])

        }

      })

    })

  })

  products.forEach(extractInformation => {

    arrayWithIds.push(extractInformation.idOfProduct)

    arrayWithNames.push(extractInformation.nameOfProduct)

    arrayWithQuantity.push(extractInformation.quantityUserWant)

  })

  db.run(`INSERT INTO delivery (idOfDelivery, idOfProduct, nameOfProduct, quantityOfProduct, directionOfClient, telephoneNumberClient, priceInTotal, nameOfUser, carnetIdNumber, idOfUser) VALUES (?,?,?,?,?,?,?,?,?,?)`, [uuidv4(), JSON.stringify(arrayWithIds),
  JSON.stringify(arrayWithNames), JSON.stringify(arrayWithQuantity), locationOfUser, telephoneNumberOfUser, totalPrice, nameOfUser, idNumberUser, idOfUser])

  res.sendStatus(200)

})

/* Select all information about deliveries */
app.get("/send-products-in-delivery", (req, res) => {

  db.all(`SELECT * FROM delivery`, (err, rows) => {

    res.send(rows)

  })

})

/* See if the product was successfully delivered or not */
app.get("/was-product-successfully-delivered", (req, res) => {

  const informationOfProduct = req.query.informationOfProduct

  const specificDeliveryStatus = req.query.specificDeliveryStatus

  db.run(`DELETE FROM delivery WHERE idOfDelivery == (?)`, [informationOfProduct.idOfDelivery])

  /* If the status of delivery is true (the product was delivered successfully) then execute this */
  if (specificDeliveryStatus === "true") {

    db.all(`SELECT * FROM specialProductsCases`, (err, rows) => {

      rows.forEach(row => {

        JSON.parse(informationOfProduct.idOfProduct).forEach(extractedId => {

          if (row.idOfProduct === extractedId) {

            db.run(`DELETE FROM specialProductsCases WHERE idOfProduct == (?)`, [extractedId])

          }

        })

      })

    })

    db.run(`INSERT INTO statistics (totalGainedFromThisBuy, nameOfProducts, idOfProducts, statusOfBuy, nameOfTheClient, carnetNumberOfClient, idOfUser) VALUES (?,?,?,?,?,?,?)`, [informationOfProduct.priceInTotal,
    JSON.stringify(informationOfProduct.nameAndQuantityOfProducts.nameAndQuantityOfProducts), informationOfProduct.idOfProduct, "El producto se vendio perfectamente",
    informationOfProduct.nameOfUser, informationOfProduct.carnetIdNumber, informationOfProduct.idOfUser])

    res.sendStatus(200)

    /* If the status of delivery is false (the product failed in being delivered) then execute this */
  } else if (specificDeliveryStatus === "false") {

    /* Here put the payment system to give back the money to the client */
    /* PON AQUI EL SISTEMA DE FALLO DE COMPRA! */

    let isDeliveryFailed = false

    JSON.parse(informationOfProduct.quantityOfProduct).forEach((extractProductsQuantity, indexOfProductsInfo) => {

      db.all(`SELECT * FROM specialProductsCases`, (err, rows) => {

        rows.forEach(row => {

          isDeliveryFailed = true

          if (isDeliveryFailed === true) {

            db.run(`INSERT INTO products (idOfProduct, nameOfProduct, descriptionOfProduct, quantityOfProduct, priceOfProduct, imageNameOfProduct, imageOfProduct, typeOfProduct) VALUES (?,?,?,?,?,?,?,?)`,
              [row.idOfProduct, row.nameOfProduct, row.descriptionOfProduct, row.quantityOfProduct, row.priceOfProduct, row.imageNameOfProduct, row.imageOfProduct, row.typeOfProduct])

            db.run(`DELETE FROM specialProductsCases WHERE idOfProduct == (?)`, [row.idOfProduct])

          }

        })

      })

      if (isDeliveryFailed === false) {

        db.all(`SELECT quantityOfProduct FROM products WHERE idOfProduct == (?)`, [JSON.parse(informationOfProduct.idOfProduct)[indexOfProductsInfo]], (err, rowsElse) => {

          rowsElse.forEach(rowElse => {

            db.run(`UPDATE products SET quantityOfProduct = (?) WHERE idOfProduct == (?)`, [parseInt(rowElse.quantityOfProduct) + parseInt(extractProductsQuantity)
              , JSON.parse(informationOfProduct.idOfProduct)[indexOfProductsInfo]])

          })

        })

      }

    })

    db.run(`INSERT INTO statistics (totalGainedFromThisBuy, nameOfProducts, idOfProducts, statusOfBuy, nameOfTheClient, carnetNumberOfClient, idOfUser) VALUES (?,?,?,?,?,?)`, [informationOfProduct.priceInTotal,
    JSON.stringify(informationOfProduct.nameAndQuantityOfProducts.nameAndQuantityOfProducts), informationOfProduct.idOfProduct, "ESTA COMPRA FALLO EN VENDERSE",
    informationOfProduct.nameOfUser, informationOfProduct.carnetIdNumber, informationOfProduct.idOfUser])

    res.sendStatus(200)

  }

})

/* Send information of all products to statistics of admin */
app.get("/send-information-to-statistics-to-admin", (req, res) => {

  db.all(`SELECT * FROM statistics`, (err, rows) => {

    res.send(rows)

  })

})

/* Send information of all products to statistics of client */
app.get("/send-information-to-statistics-to-client", (req, res) => {

  const idOfUser = req.query.idOfUser

  let arrayWithModifiedStatus = []

  /* Select all from statistics where the id of user is equal of the client that enter to the statistic page */
  db.all(`SELECT * FROM statistics WHERE idOfUser == (?)`, [idOfUser], (err, rows) => {

    rows.forEach(row => {

      arrayWithModifiedStatus.push(row)

    })

    /* Changing names for a better client experience */
    for (let index = 0; index < arrayWithModifiedStatus.length; index++) {

      if (arrayWithModifiedStatus[index].statusOfBuy == "El producto se vendio perfectamente") {

        arrayWithModifiedStatus[index].statusOfBuy = "El producto fue entregado a usted perfectamente"

      } else if (arrayWithModifiedStatus[index].statusOfBuy != "El producto se vendio perfectamente") {

        arrayWithModifiedStatus[index].statusOfBuy = "El producto fallo en entregarse a usted"

      }

    }

  })

  /* Send all the deliveries in process this user have */
  db.all(`SELECT * FROM delivery WHERE idOfUser == (?)`, [idOfUser], (err, rows) => {

    rows.forEach(row => {

      Object.assign(row, { statusOfBuy: "En proceso de entrega" })

      arrayWithModifiedStatus.push(row)

    })

    res.send(arrayWithModifiedStatus)

  })

})
