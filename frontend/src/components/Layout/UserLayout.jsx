import { Outlet } from "react-router-dom"
import Footer from "../Common/Footer"
import Header from "../Common/Header"

const UserLayout = () => {
  return (
    <div>
        {/* header */}
        <Header/>
        {/* main content */}
        <main>
          <Outlet/> 
        </main>
        {/* footer */}
        <Footer/>
    </div>
  )
}

export default UserLayout
