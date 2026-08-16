import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UseUserContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutatuins";
import { barLinks } from "@/constants";
import { useEffect } from "react";
import type { INavLink } from "@/types";
import { INITIAL_USER } from "@/context/AuthConstants";


const LeftSideBar = () => {
  const { mutate: signout, isSuccess } = useSignoutAccount()
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useUserContext()
  const { pathname } = useLocation();

 
  useEffect(() => {
    
    if (isSuccess) {
      setIsAuthenticated(false)
      setUser(INITIAL_USER)

      navigate('/sign-in')
    }
  }, [isSuccess, navigate, setIsAuthenticated, setUser]);
  
  return (
    <aside className="leftsidebar">

        <nav className="flex flex-col m-auto   w-30 h-80">

        
          {barLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            const handleClick = (e: React.MouseEvent) => {
              if (isActive) {
              e.preventDefault()
              window.location.reload()
              }
    }

            return (

                <NavLink
                  to={link.route}
                  key={link.label}
                   onClick={handleClick}
                  className={`leftsidebar-NavLink ${
                  isActive && " bg-primary-500"
                } `}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`size-3 invert-white ${
                      isActive && ""
                    }`}
                  />
                  {link.label}
                  
                </NavLink>
              
            );
          })}
        
        </nav>
      
      <button type="button" className="flex gap-2 mb-5"
       onClick={() => signout()}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="cursor-pointer"
            />
            <p className="text-[1rem] text-white ">Log out</p>
      </button>
      </aside>
  )
}

export default LeftSideBar