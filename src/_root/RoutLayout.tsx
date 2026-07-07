import Bottombar from '@/components/shared/Bottombar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import Topbar from '@/components/shared/Topbar'
import { useUserContext } from '@/context/UseUserContext'
import { Outlet, useNavigate } from 'react-router-dom'

const RoutLayout = () => {

    const { isAuthenticated, isLoading } = useUserContext()
    const navigate = useNavigate()
    if (isLoading) return null
    if (!isAuthenticated) return navigate('/sign-in')

  return (
    <div className="w-full bg-dark-4 text-amber-50">
      <Topbar />
      <LeftSideBar />
      <section className=" h-screen  ml-40 [@media(max-width:768px)]:ml-0" >
        <Outlet />
      </section>
      <Bottombar />
    </div>
  )
}

export default RoutLayout