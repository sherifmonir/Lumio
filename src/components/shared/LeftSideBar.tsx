import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UseUserContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutatuins";
import { ClipLoader } from "react-spinners";
import { sidebarLinks } from "@/constants";
import { useEffect } from "react";
import type { INavLink } from "@/types";
import { INITIAL_USER } from "@/context/AuthConstants";


const LeftSideBar = () => {
  const { mutate: signout, isSuccess } = useSignoutAccount()
  const navigate = useNavigate()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
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

    
        
        {isLoading  ? (
          <div className="h-14 bg-amber-100">
            <ClipLoader />
          </div>
        ):(
          <Link to={`/profile/${user.id}`} className="leftsidebar-link">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-10 w-10  rounded-full"
            />
            <div className="flex flex-col">
              <p className="bold-body text-[0.8rem] text-light-1">{user.name}</p>
              <p className=" small-regular text-[0.6rem] text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}
        <nav className="flex flex-col  w-30 h-80 ">

        
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              
              
                
                
                <NavLink
                  to={link.route}
                  key={link.label}
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
            />
            <p className="text-[1rem] text-white ">Log out</p>
      </button>
      </aside>
    
  )
}

export default LeftSideBar