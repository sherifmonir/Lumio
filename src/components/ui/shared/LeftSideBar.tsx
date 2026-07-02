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
    <aside className="fixed z-40 flex flex-col justify-between items-center pt-20 bottom-0 h-full left-0 w-30  bg-dark-2  ">

    
        
        {isLoading  ? (
          <div className="h-14 bg-amber-100">
            <ClipLoader />
          </div>
        ):(
          <Link to={`/profile/${user.id}`} className="gap-2 flex flex-col flex-around font-medium h-6 text-white m-1">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8  rounded-full"
            />
            <div className="flex flex-col">
              <p className="bold-body text-[0.7rem] text-light-1">{user.name}</p>
              <p className=" small-regular text-[0.5rem] text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}
        <nav className="flex  flex-col p-1 items-center  w-20 h-70  bg-dark-2 rounded-md">

        <ul className="flex flex-col gap-4">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              
              <li
                key={link.label}
                className={`flex-center px-1 py-0.5 bg-dark-5   hover:bg-primary-500 rounded-sm ${
                  isActive && " bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className={`text-[0.7rem] text-white gap-2 flex-center ${
                  isActive && ""
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
              </li>
            );
          })}
        </ul>
        </nav>
      
      <button type="button" className=" py-1"
       onClick={() => signout()}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            />
            <p className="small-meduim lg-base-medium ">Log out</p>
      </button>
      </aside>
    
  )
}

export default LeftSideBar