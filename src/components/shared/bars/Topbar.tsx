import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '@/context/UseUserContext'
import { useGetUserById } from '@/lib/react-query/queriesAndMutatuins'
import NotificationBell from '@/components/shared/notifications/NotificationBell'
import MobileMenu from './MobileMenu'
import { ClipLoader } from 'react-spinners'

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading } = useUserContext()
  const { data: currentUser } = useGetUserById(user.id)

  return (
    <section className="topbar">
      <div className="flex gap-4 relative items-center h-full">
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

        <Link to='/' className="mx-auto">
          <img src="/assets/images/logo.svg" alt="Logo" width={170} height={300} />
        </Link>

        <div className="flex-center absolute right-3 lg:right-8">
          <NotificationBell />
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </section>
  )
}

export default Topbar