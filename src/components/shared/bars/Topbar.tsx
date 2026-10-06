import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '@/context/UseUserContext'
import { useGetUserById } from '@/lib/react-query/queriesAndMutatuins'
import NotificationBell from '@/components/shared/notifications/NotificationBell'
import MobileMenu from './MobileMenu'
import { ClipLoader } from 'react-spinners'
import { useThemeContext } from '@/context/UseThemeContext'

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading } = useUserContext()
  const { data: currentUser } = useGetUserById(user.id)
    const { toggleTheme } = useThemeContext()
  

  return (
    <section className="topbar">
      <div className="flex  relative items-center h-full">
        <button onClick={() => setIsMenuOpen(true)} className="lg:hidden absolute left-3 cursor-pointer">
          <img src="/assets/icons/menu.svg" alt="menu" className="h-10 w-10" />
        </button>

        {isLoading ? (
          <div className="hidden lg:block absolute left-8">
            <ClipLoader size={15} />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="hidden lg:flex absolute left-8">
            <img
              src={currentUser?.imageUrl || user.imageUrl}
              alt="profile"
              className="rounded-full w-12 h-12"
            />
          </Link>
        )}

        <Link to='/' className="flex-center gap-2 mx-auto  h-full" >
          <img src="/assets/icons/favicon.svg" alt="Logo" width={40} height={40} />  
          <p className="text-foreground text-4xl font-bold">LUMIO</p>
        </Link>

        <div className=" flex-center  absolute right-1 lg:right-8 h-full">
          <button type="button" className="cursor-pointer [@media(max-width:64rem)]:hidden"
            onClick={toggleTheme}>
            <img 
            src="/assets/icons/dark-mode.svg"
            alt="toggle theme"
            className="h-8 w-8"
            />
        </button>
        <div className="">
            <NotificationBell />
        </div>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  )
}

export default Topbar