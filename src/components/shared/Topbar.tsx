import { useSignoutAccount } from '@/lib/react-query/queriesAndMutatuins'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserContext } from '@/context/UseUserContext'
import { INITIAL_USER } from '@/context/AuthConstants'
import { ClipLoader } from 'react-spinners'
import { getFilePreview } from '@/lib/appwrite/api'

const Topbar = () => {
  const { mutate: signout, isSuccess } = useSignoutAccount()
  const navigate = useNavigate()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()

  useEffect(() => {
    
    if (isSuccess) {
      setIsAuthenticated(false)
      setUser(INITIAL_USER)

      navigate('/sign-in')
    }
  }, [isSuccess, navigate, setIsAuthenticated, setUser]);


  
  return (
    <section className="topbar">
      <div className="py-4 px-5 flex-center  justify-between">

        {isLoading  ? (
          <div className="h-14 bg-amber-100">
            <ClipLoader />
          </div>
        ):(
          <Link to={`/profile/${user.id}`}>
            <img
              src={user.imageId
                ?getFilePreview(user.imageId)
                :"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="rounded-full w-12 lg:h-12"
            />
            
          </Link>
        )}

        <Link to='/'>
        <img
          src="/assets/images/logo.svg"
          alt="Logo"
          width={170}
          height={300}
        />
        </Link>
        
          <button type="button"  onClick={() => signout()}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="cursor-pointer"
            />
          </button>
      </div>
    </section>
  )
}

export default Topbar