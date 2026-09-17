import { useGetUserById, useSignoutAccount } from '@/lib/react-query/queriesAndMutatuins'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUserContext } from '@/context/UseUserContext'
import { INITIAL_USER } from '@/context/AuthConstants'
import { ClipLoader } from 'react-spinners'
import NotificationBell from '@/components/shared/NotificationBell'
import ConfirmationModal from './ConfirmationModal'

const Topbar = () => {
  const { mutate: signout, isSuccess, isPending: isSigningOut   } = useSignoutAccount()
  const navigate = useNavigate()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
  const { data: currentUser } = useGetUserById(user.id)
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false)

  useEffect(() => {
    
    if (isSuccess) {
      setIsAuthenticated(false)
      setUser(INITIAL_USER)

      navigate('/sign-in')
    }
  }, [isSuccess, navigate, setIsAuthenticated, setUser])

  
  
  return (
    <section className="topbar">
      <div className="flex gap-4 relative items-center h-full">

        {isLoading  ? (
          <div className="h-14 bg-amber-100">
            <ClipLoader />
          </div>
        ):(
          <Link to={`/profile/${user.id}`} className="absolute left-3 lg:left-8">
            <img
              src={currentUser?.imageUrl || user.imageUrl}
              alt="profile"
              className="rounded-full w-12 lg:h-12"
            />
            
          </Link>
        )}

        <Link to='/' className="mx-auto">
        <img
          src="/assets/images/logo.svg"
          alt="Logo"
          width={170}
          height={300}
        />
        </Link>
        <div className="flex-center absolute right-3 lg:right-8">
          <NotificationBell />
          <button type="button" onClick={() => setIsSignoutModalOpen(true)}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="cursor-pointer"
            />
          </button>
          <ConfirmationModal
          loadingLabel="Signing Out"
          isOpen={isSignoutModalOpen}
          onClose={() => setIsSignoutModalOpen(false)}
          onConfirm={() => signout()}
          title="Sign Out"
          description="Are you sure you want to Sign Out?"
          confirmLabel="Sign out"
          isLoading={isSigningOut}
          variant= "primary"
          />
        </div>
      </div>
    </section>
  )
}

export default Topbar