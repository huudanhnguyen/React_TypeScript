import { Outlet } from "react-router-dom"
import AppHeader from "./components/layouts/app.header"
import { useEffect } from "react"
import { fetchAccountAPI } from "./services/api"

function Layout() {
  useEffect(()=>{
    const fetchAccount= async()=>{
      const res=await fetchAccountAPI();
      console.log(res)
    }
    fetchAccount();
  },[])
  return (
    <>
    <div>
      <AppHeader/>
      <Outlet/>
    </div>

    </>
  )
}

export default Layout
