import { useUserContext } from "@/context/UseUserContext"
import { useGetUserById, useSignoutAccount } from "@/lib/react-query/queriesAndMutatuins"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { INITIAL_USER } from '@/context/AuthConstants'
import { ClipLoader } from "react-spinners"
import ConfirmationModal from "@/components/ui/ConfirmationModal"



const MenuBar = () => {
    const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
    const { mutate: signout, isSuccess, isPending: isSigningOut   } = useSignoutAccount()
    const { data: currentUser } = useGetUserById(user.id)
    const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        
        if (isSuccess) {
          setIsAuthenticated(false)
          setUser(INITIAL_USER)
    
          navigate('/sign-in')
        }
      }, [isSuccess, navigate, setIsAuthenticated, setUser])
  
  return (
    <div className="flex flex-col flex-center h-full gap-5 ">
      <div className=" flex flex-col items-start h-80 gap-7">
      {isLoading  ? (
          <div className="h-14 bg-amber-100">
            <ClipLoader size={15} />
          </div>
        ):(
          <Link to={`/profile/${user.id}`} className="flex gap-2">
            <img
              src={currentUser?.imageUrl || user.imageUrl}
              alt="profile"
              className="rounded-full w-12 lg:h-12"
            />
            <div className="flex flex-col justify-start items-start">
              <p className="font-bold text-[16px]">
                {user.name}
              </p>
              <p className="text-[12px]">
                @{user.username}
              </p>
            </div>
            
          </Link>
        )}

      <Link
        to="/saved"
        className="text-primary-500 flex-center gap-2">
          <img
            src="/assets/icons/bookmark.svg"
            alt="saved"
            className="size-8"
            />
            <p className="text-amber-50">Saved</p>
        </Link>

      <div className="flex report-bug flex-center gap-2">
        <img
         src="/assets/icons/bug-report.svg"
         alt="report a bug"
         className="size-8"
         />
        <p className="text-amber-50">
          report a bug
        </p>
      </div>

      <div className=" flex dark-mode flex-center gap-2">
        <img
         src="/assets/icons/dark-mode.svg"
         alt="change mode"
         className="size-8"
         />
        <p className="text-amber-50">
          dark mode
        </p>
      </div>
      <div className="logout cursor-pointer">
      <button type="button" className="flex flex-center  gap-2 w-full h-full" onClick={() => setIsSignoutModalOpen(true)}>
            <img 
            src="/assets/icons/logout.svg"
            alt="logout"
            className="cursor-pointer size-8"
            
            />
            <p className="text-amber-50">Log Out</p>
          </button>
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
        </div>
      </div>
    </div>
  )
}

export default MenuBar