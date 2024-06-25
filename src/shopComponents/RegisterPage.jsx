import { Link } from "react-router-dom"

import axios from "axios"

import { useState } from "react"

function RegisterPage() {

  // Here is the port of the server frontend will be connected
  const portOfServer = "http://localhost:4000/"

  //UseStates
  const [userName, setUserName] = useState("")

  const [password, setPassword] = useState("")

  const [email, setEmail] = useState("")

  const [telephoneNumber, setTelephoneNumber] = useState("")

  /* UseStates For Warnings */
  const [advertNoSupportedEmail, setAdvertNoSupportedEmail] = useState(false)

  const [advertNoSupportedPassword, setAdvertNoSupportedPassword] = useState(false)

  const [advertNoSupportedTelephoneNumber, setAdvertNoSupportedTelephoneNumber] = useState(false)

  const [advertEveryInputIsEmpty, setAdvertEveryInputIsEmpty] = useState(false)

  const [advertUsernameTaken, setAdvertUsernameTaken] = useState(false)

  const [advertEmailTaken, setAdvertEmailTaken] = useState(false)

  //Events
  const eventUserName = (event) => {
    setUserName(event.target.value)
  }

  const eventPassword = (event) => {
    setPassword(event.target.value)
  }

  const eventEmail = (event) => {
    setEmail(event.target.value)
  }

  const eventTelephoneNumber = (event) => {
    setTelephoneNumber(event.target.value)
  }

  //Get information and send it to backend
  const handleSubmit = () => {

    axios.get(`${portOfServer}insert-credentials-to-database`, { params: { userName: userName, password: password, email: email, telephoneNumber: telephoneNumber } }).then((res) => {

      res.data.forEach(mistakesFromUser => {

        console.log(mistakesFromUser)

        if (userName === "" && password === "" && email === "" && telephoneNumber === "") {

          setAdvertEveryInputIsEmpty(true)

        } else {

          if (mistakesFromUser === "USERNAME ALREADY TAKEN") {

            setAdvertUsernameTaken(true)

          }

          if (mistakesFromUser === "EMAIL ALREADY TAKEN") {

            setAdvertEmailTaken(true)

          }

          if (mistakesFromUser === "INVALID EMAIL") {

            setAdvertNoSupportedEmail(true)

          }

          if (mistakesFromUser === "INVALID PASSWORD") {

            setAdvertNoSupportedPassword(true)

          }

          if (mistakesFromUser === "INVALID TELEPHONE NUMBER") {

            setAdvertNoSupportedTelephoneNumber(true)

          }

          if (mistakesFromUser === "USER PUT CORRECT CREDENTIALS") {

            sessionStorage.setItem("isUserLogged", true)

            window.location.href = "http://localhost:5173/"

          }

        }

      })

    })

  }

  return (

    <>

      <h1 className="sm:mb-4 text-3xl mt-4 duration-500 hover:text-4xl">Bienvenido A CubaShopp</h1>

      {window.innerWidth < 912 ? void (0) :

        <>

          <div className="sm:hidden bg-stone-900 rounded-l-3xl duration-500 hover:rotate-12 rotate-6 w-36 h-36 absolute left-80 top-44"></div>

          <div className="sm:hidden bg-stone-900 rounded-b-full duration-500 hover:rotate-12 hover:bg-stone-700 opacity-65 -rotate-12 w-36 h-36 absolute left-[700px] top-[500px]"></div>

        </>

      }

      <div className="sm:w-[310px] sm: sm:h-[700px] border-4 md:backdrop-blur-sm border-stone-400 hover:border-stone-500 shadow-xl duration-500 hover:shadow-[0_50px_70px_3px_rgba(0,0,0,0.3)] rounded-xl m-auto top-0 bottom-0 right-0 left-0 w-[400px] h-[620px]">

        <div className="inputs-buttons-from-square">

          <h1 className="mb-8 mt-8 text-3xl font-normal">Bienvenido a Registro</h1>

          {/* Name */}

          <h2 className="mb-4 mt-4 text-xl">Nombre</h2>

          <input className="sm:h-[50px] border-2 w-[270px] duration-500 hover:border-slate-300 placeholder-slate-600" id="name-input" onChange={eventUserName} placeholder="Ponga aqui su nombre de usuario"></input>

          {/* Password */}

          <h2 className="mb-4 mt-4 text-xl">Contraseña</h2>

          <input className="sm:h-[50px] border-2 w-[270px] duration-500 hover:border-slate-300 placeholder-slate-600" type="password" id="password-input" onChange={eventPassword} placeholder="Ponga aqui su contraseña"></input>


          {/* Email */}

          <h2 className="mb-4 mt-4 text-xl">Email</h2>

          <input className="sm:h-[50px] border-2 w-[270px] duration-500 hover:border-slate-300 placeholder-slate-600" type="email" id="email-input" onChange={eventEmail} placeholder="Ponga aqui su email"></input>

          {/* Telephone Number */}

          <h2 className="mb-4 mt-4 text-xl">Su numero telefonico</h2>

          <input className="sm:h-[50px] border-2 w-[270px] duration-500 hover:border-slate-300 placeholder-slate-600" id="telephone-number-input" onChange={eventTelephoneNumber} type="number" placeholder="Ponga aqui su numero telefonico"></input>

          <br></br>

          <button className="mt-8 mb-8 border-2 w-52 duration-500 bg-stone-800 hover:bg-stone-950 rounded-lg text-white" onClick={handleSubmit}>Registrarse</button>

          {advertUsernameTaken === true && <h1>Su nombre de usuario ya existe</h1>}

          {advertEmailTaken === true && <h1>Su email ya existe</h1>}

          {advertNoSupportedEmail === true && <h1>Su Email No Es Valido</h1>}

          {advertNoSupportedPassword === true && <h1>Su contraseña no contiene ningun caracter especial o no tiene 7 o mas caracteres</h1>}

          {advertNoSupportedTelephoneNumber === true && <h1>Su numero de telefono no es Valido</h1>}

          {advertEveryInputIsEmpty === true && <h1>Todos sus formularios estan vacios!</h1>}

          <div>

            <button className="register-link border-2 w-36 duration-500 hover:bg-stone-800 bg-stone-700 rounded-md text-white" onClick={() => window.location.href = "http://localhost:5173/login"}>Ir a la pagina de login</button>

          </div>

        </div>

      </div>

    </>

  )

}

export default RegisterPage