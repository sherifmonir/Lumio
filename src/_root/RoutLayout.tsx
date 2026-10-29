import Bottombar from '@/components/shared/bars/Bottombar'
import LeftSideBar from '@/components/shared/bars/LeftSideBar'
import Topbar from '@/components/shared/bars/Topbar'
import { useUserContext } from '@/context/UseUserContext'
import { Navigate, Outlet } from 'react-router-dom'

const RoutLayout = () => {

    const { isAuthenticated, isLoading } = useUserContext()
    if (isLoading) return null
    if (!isAuthenticated) return <Navigate to="/sign-in" replace />

  return (
    <div className="w-full bg-background text-foreground">
      <Topbar />
      <LeftSideBar />
      <section className="h-screen  ml-40  [@media(max-width:64rem)]:ml-0" >
        <Outlet />
      </section>
      <Bottombar />
    </div>
  )
}

export default RoutLayout