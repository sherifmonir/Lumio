import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UseUserContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutatuins";
import {  leftsideBarLinks } from "@/constants";
import { useEffect, useState } from "react";
import type { INavLink } from "@/types";
import { INITIAL_USER } from "@/context/AuthConstants";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import BugReportModal from "@/components/ui/BugReportModal";

const LeftSideBar = () => {
    const { mutate: signout, isSuccess, isPending: isSigningOut   } = useSignoutAccount()
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useUserContext()
  const { pathname } = useLocation();
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false)
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false) 

 
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
                    className={`size-3  ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                  
                </NavLink>
              
            );
          })}
          
        </nav>


    <div className="flex pl-2 flex-col gap-2 m-auto w-full h-30 ">
      <button 
            type="button" 
            onClick={() => setIsBugReportModalOpen(true)} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/assets/icons/report-bug.svg" alt="report a bug" className="h-8 w-8" />
            <p className="text-foreground">Report a Bug</p>
          </button>

      <button type="button" className="flex gap-2 mb-5 cursor-pointer"
       onClick={() => setIsSignoutModalOpen(true)}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="h-8 w-8"
            />
            <p className="text-[1rem] text-foreground">Sign out</p>
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
          <BugReportModal 
        isOpen={isBugReportModalOpen} 
        onClose={() => setIsBugReportModalOpen(false)} 
      />
      </aside>
  )
}

export default LeftSideBar