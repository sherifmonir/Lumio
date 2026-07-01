import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UseUserContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutatuins";
import { ClipLoader } from "react-spinners";
import { sidebarLinks } from "@/constants";
import { useEffect } from "react";
import type { INavLink } from "@/types";


const LeftSideBar = () => {
  const { user, isLoading } = useUserContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mutate: signout, isSuccess } = useSignoutAccount()

  useEffect(() => {
      
      if (isSuccess)
        navigate('/sign-in')
    }, [isSuccess])
  
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11 item-center">
        
        {isLoading || !user.email ? (
          <div className="h-14">
            <ClipLoader />
          </div>
        ):(
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
            <div className="flex flex-col">
              <p className="bold-body text-light-2">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <button type="button" className="ghost_buttom"
       onClick={() => signout()}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            />
      </button>
    </nav>
  )
}

export default LeftSideBar