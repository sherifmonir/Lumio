import { useSignoutAccount } from '@/lib/react-query/queriesAndMutatuins'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserContext } from '@/context/UseUserContext'

const Topbar = () => {
  const { mutate: signout, isSuccess } = useSignoutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    
    if (isSuccess)
      navigate('/sign-in')
  }, [isSuccess])


  
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to='/' className="flex gap-3 items-center">
        <img
          src="/assets/images/logo.svg"
          alt="Logo"
          width={130}
          height={325}
        />
        </Link>
        <div className="flex gap-3">
          <button type="button" className="ghost_buttom" onClick={() => signout()}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            />
          </button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Topbar