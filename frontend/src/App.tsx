import { Outlet } from "react-router-dom"
import AppHeader from "./components/layouts/app.header"

function App() {

  return (
    <>
    <div>
      <AppHeader/>
      <Outlet/>
    </div>

    </>
  )
}

export default App
