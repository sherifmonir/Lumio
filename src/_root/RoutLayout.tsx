import Bottombar from '@/components/ui/shared/Bottombar'
import LeftSideBar from '@/components/ui/shared/LeftSideBar'
import Topbar from '@/components/ui/shared/Topbar'
import { useUserContext } from '@/context/UseUserContext'
import { Navigate, Outlet } from 'react-router-dom'

const RoutLayout = () => {

    const { isAuthenticated, isLoading } = useUserContext()
    if (isLoading) return null
    if (!isAuthenticated) return <Navigate to="/sign-in" />

  return (
    <div className="w-full">
      <Topbar />
      <LeftSideBar />
      <section className="ml-30" >
        <Outlet />
      </section>
      <Bottombar />
    </div>
  )
}

export default RoutLayout