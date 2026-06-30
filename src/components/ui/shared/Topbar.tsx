import { useSigninAccount } from '@/lib/react-query/queriesAndMutatuins'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Topbar = () => {
  const { mutate: signout, isSuccess } = useSigninAccount()
  const navigate = useNavigate()

  useEffect(() => {
    
    if (isSuccess)
      navigate(0)
  }, [isSuccess, navigate])


  
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
        </div>

      </div>
    </section>
  )
}

export default Topbar