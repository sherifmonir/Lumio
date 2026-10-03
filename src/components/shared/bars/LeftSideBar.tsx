import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UseUserContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutatuins";
import {  leftsideBarLinks } from "@/constants";
import { useEffect, useState } from "react";
import type { INavLink } from "@/types";
import { INITIAL_USER } from "@/context/AuthConstants";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useThemeContext } from "@/context/UseThemeContext";

const LeftSideBar = () => {
    const { mutate: signout, isSuccess, isPending: isSigningOut   } = useSignoutAccount()
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useUserContext()
  const { theme, toggleTheme } = useThemeContext()
  const { pathname } = useLocation();
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false)

 
  useEffect(() => {
    
    if (isSuccess) {
      setIsAuthenticated(false)
      setUser(INITIAL_USER)

      navigate('/sign-in')
    }
  }, [isSuccess, navigate, setIsAuthenticated, setUser]);
  
  return (
    <aside className="leftsidebar">

        <nav className="flex flex-col justify-center m-auto w-30 h-80">

        
          {leftsideBarLinks.map((link: INavLink) => {
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


    <div className="flex pl-2 flex-col m-auto w-40 h-30 ">
      <button type="button" className="flex gap-2 mb-5 cursor-pointer"
      onClick={toggleTheme}>
          <img 
          src="/assets/icons/dark-mode.svg"
          alt="toggle theme"
          className="h-8 w-8"
          />
          <p className="text-[1rem] text-white">{theme === "dark" ? "Light mode" : "Dark mode"}</p>
      </button>

      <button type="button" className="flex gap-2 mb-5 cursor-pointer"
       onClick={() => setIsSignoutModalOpen(true)}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="h-8 w-8"
            />
            <p className="text-[1rem] text-white ">Log out</p>
      </button>
    </div>
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
      </aside>
  )
}

export default LeftSideBar