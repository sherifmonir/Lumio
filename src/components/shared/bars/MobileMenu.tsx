import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '@/context/UseUserContext'
import { useGetUserById, useSignoutAccount } from '@/lib/react-query/queriesAndMutatuins'
import { INITIAL_USER } from '@/context/AuthConstants'
import { ClipLoader } from 'react-spinners'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import BugReportModal from '@/components/ui/BugReportModal'
import { useThemeContext } from "@/context/UseThemeContext";

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
  const { mutate: signout, isSuccess, isPending: isSigningOut } = useSignoutAccount()
  const { data: currentUser } = useGetUserById(user.id)
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false)
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false) 
  const { theme, toggleTheme } = useThemeContext()
  const navigate = useNavigate()

  const closeMenu = () => {
    setIsSignoutModalOpen(false)
    setIsBugReportModalOpen(false)
    onClose()
  }

  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(false)
      setUser(INITIAL_USER)
      navigate('/sign-in')
    }
  }, [isSuccess, navigate, setIsAuthenticated, setUser])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeMenu])

  return createPortal(
    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}>
      <div className="absolute inset-0 bg-background/70" onClick={onClose} />

      <div className={`absolute left-0 top-0 h-full p-2  w-[70%] max-w-sm  bg-card  transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col  items-start h-full gap-8">
          {isLoading ? (
            <div className="h-14 "><ClipLoader size={15} /></div>
          ) : (
            <Link to={`/profile/${user.id}`} onClick={onClose} className="flex gap-4 mb-10  w-full p-6 border-b border-primary-500 cursor-pointer">
              <img src={currentUser?.imageUrl || user.imageUrl} alt="profile" className="rounded-full w-12 h-12" />
              <div className="flex flex-col justify-start items-start">
                <p className="font-bold text-[16px] text-foreground">{user.name}</p>
                <p className="text-[12px] text-foreground">@{user.username}</p>
              </div>
            </Link>
          )}

          <Link to="/saved" onClick={onClose} className=" flex items-center border-b border-muted-foreground w-full p-2 justify-start gap-2 ">   
            <img src="/assets/icons/bookmark.svg" alt="saved" className="h-8 w-8" />
            <p className="text-foreground">Saved</p>
          </Link>

          <div className="gap-2 border-b border-muted-foreground w-full p-2">
             <button 
            type="button" 
            onClick={() => setIsBugReportModalOpen(true)} 
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/assets/icons/report-bug.svg" alt="report a bug" className="h-8 w-8" />
            <p className="text-foreground">Report a Bug</p>
          </button>
          </div>

          <div className="gap-2 border-b border-muted-foreground w-full p-2">
            <button type="button" className="flex items-center gap-2 cursor-pointer"
              onClick={toggleTheme}>
                  <img 
                  src="/assets/icons/dark-mode.svg"
                  alt="toggle theme"
                  className="h-8 w-8"
                  />
                  <p className="text-[1rem] text-foreground">{theme === "dark" ? "Light mode" : "Dark mode"}</p>
              </button>

          </div>

          <div className="gap-2 border-b border-muted-foreground w-full p-2">
            <button type="button" className="flex items-center gap-2 cursor-pointer" onClick={() => setIsSignoutModalOpen(true)}>
              <img src="/assets/icons/logout.svg" alt="logout" className="h-8 w-8" />
              <p className="text-foreground">Sign Out</p>
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
              variant="primary"
            />
          </div>
        </div>
      </div>
      <BugReportModal 
        isOpen={isBugReportModalOpen} 
        onClose={() => setIsBugReportModalOpen(false)} 
      />
    </div>,
    document.body
  )
}

export default MobileMenu