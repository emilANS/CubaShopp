import { useEffect, useState } from "react"

import axios from "axios"

import { Link } from "react-router-dom"

function LoginPage() {

  // Here is the port of the server frontend will be connected
  const portOfServer = "http://localhost:4000/"

  //UseStates
  const [userName, setUserName] = useState("")

  const [password, setPassword] = useState("")

  const [email, setEmail] = useState("")

  //Warnings
  const [notEqualCredentials, setNotEqualCredentials] = useState(false)

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

  const handleSubmit = () => {

    axios.get(`${portOfServer}get-credentials-to-login-user`, { params: { userName: userName, password: password, email: email } }).then((res) => {

      console.log(res.data)

      if (res.data.status === "credentialsAreCorrect") {

        sessionStorage.setItem("isUserLogged", true)

        sessionStorage.setItem("idOfUser", res.data.id)

        window.location.href = "http://localhost:5173/shopPageUserLogged"

      } else if (res.data.status === "credentialsAreCorrectADMIN") {

        sessionStorage.setItem("userIsAdmin", true)

        window.location.href = "http://localhost:5173/AdminPage1"

      } else {

        setNotEqualCredentials(true)

      }

    })

  }

  return (

    <div className="background">

      {window.innerWidth < 912 ? void (0) :

        <>
        
          <div className="sm:hidden bg-stone-900 duration-500 hover:rotate-12 rotate-6 w-36 h-36 absolute left-80 top-44"></div>

          <div className="sm:hidden bg-stone-900 duration-500 hover:rotate-12 hover:bg-stone-700 opacity-65 -rotate-12 w-36 h-36 absolute left-[700px] top-[500px]"></div>

        </>
      }


      <h1 className="text-3xl mt-4 duration-500 hover:text-4xl">Bienvenido A CubaShopp</h1>

      <div>

        {sessionStorage.getItem("userHaveToLogin") === "true" && <><h2 className="text-red-900 text-[30px]">!Necesitas iniciar sesion!</h2> <hr></hr></>}

        {notEqualCredentials && <><h1 className="text-red-900 text-[30px]">!Advertencia: Las credenciales que ingreso son incorrectas!</h1> <hr></hr></>}

      </div>

      <div className="sm:w-[310px] sm:h-[600px] border-4 md:backdrop-blur-sm border-stone-400 hover:border-stone-500 shadow-xl duration-500 hover:shadow-[0_50px_70px_3px_rgba(0,0,0,0.3)] rounded-xl m-auto top-0 bottom-0 right-0 left-0 w-[400px] h-[550px]">

        <div className="inputs-buttons-from-square">

          <h2 className=" mb-8 mt-8 text-3xl font-normal">Entre sesion aqui</h2>

          {/* Name */}
          <h2 className="mb-2 text-xl">Nombre</h2>

          <input className="sm:h-[50px] mb-2 text-xl border-2 w-[270px] duration-500 hover:border-slate-300 rounded-md placeholder-slate-600" onChange={eventUserName} placeholder="Ponga aqui su nombre"></input>

          {/* Password */}
          <h2 className="mt-2 mb-2 text-xl">Contraseña</h2>

          <input type="password" className="sm:h-[50px] border-2 text-xl w-[270px] duration-500 hover:border-slate-300 placeholder-slate-600" onChange={eventPassword} placeholder="Ponga aqui su contraseña"></input>

          {/* Email */}
          <h2 className="mt-2 text-xl">Email</h2>

          <input className="sm:h-[50px] mt-2 mb-4 text-xl border-2 w-[270px] duration-500 hover:border-slate-300 placeholder-slate-600" onChange={eventEmail} placeholder="Ponga aqui su email"></input>

          <div>

            <button className="mt-8 mb-8 border-2 w-52 duration-500 bg-stone-800 hover:bg-stone-950 rounded-lg text-white" onClick={handleSubmit}>Entrar</button>

          </div>

          <div>

            <button className="register-link border-2 w-36 duration-500 hover:bg-stone-800 bg-stone-700 rounded-md text-white mb-4" onClick={() => window.location.href = "http://localhost:5173/Register"}>Ir a registrarse</button>

            <br></br>

            <button className="register-link border-2 w-64 duration-500 hover:bg-stone-800 bg-stone-600 rounded-md text-white" onClick={() => window.location.href = "http://localhost:5173/"}>Entrar a la tienda sin iniciar sesion</button>

          </div>


        </div>


      </div>

    </div>

  )

}

export default LoginPage
