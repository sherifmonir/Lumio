import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from '@/components/shared/notifications/NotificationBell'

const Topbar = () => {
  const navigate = useNavigate()

  const handleOpenMenu = () =>{
    navigate("/menu")
  }


  return (
    <section className="topbar">
      <div className="flex gap-4 relative items-center h-full">

          <button onClick={handleOpenMenu} className="absolute left-3 lg:left-8 cursor-pointer">
            <img src="/assets/icons/menu.svg"
             alt="menu"
             className="h-10 w-10"
              />
          </button>
        

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
          
        </div>
      </div>
    </section>
  )
}

export default Topbar

/*

          <Link to={`/profile/${user.id}`} className="absolute left-3 lg:left-8">
            <img
              src={currentUser?.imageUrl || user.imageUrl}
              alt="profile"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          */