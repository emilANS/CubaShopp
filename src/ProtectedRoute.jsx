import { Outlet } from "react-router-dom"
import AdminPage from "./shopComponents/AdminPage"
import ShopPage from "./shopComponents/ShopPage"

function ProtectedRoute() {

  let isUserClient = sessionStorage.getItem("isUserLogged")

  let isUserAdmin = sessionStorage.getItem("userIsAdmin")

  if (isUserAdmin === "true") {

    return <Outlet/>

  }

  if (isUserClient === "true") {

    return <Outlet/>

  }

  if (isUserClient !== "true" && isUserAdmin !== "true") {

    return(

      <h1>You don't have access to this part of the website please login first</h1>
  
    )

  }

}

export default ProtectedRoute