import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '@/context/UseUserContext'
import { useGetUserById, useSignoutAccount } from '@/lib/react-query/queriesAndMutatuins'
import { INITIAL_USER } from '@/context/AuthConstants'
import { ClipLoader } from 'react-spinners'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import BugReportModal from '@/components/ui/BugReportModal'

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
  const navigate = useNavigate()

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
    if (e.key === "Escape") onClose()
  }

  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', handleKeyDown)

  return () => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeyDown)
  }
}, [isOpen, onClose])

  return createPortal(
    <div className={`fixed inset-0 z-100 transition-opacity duration-300 ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className={`absolute left-0 top-0 h-full w-[90%] max-w-sm bg-dark-2 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full gap-5 p-6">
          {isLoading ? (
            <div className="h-14"><ClipLoader size={15} /></div>
          ) : (
            <Link to={`/profile/${user.id}`} onClick={onClose} className="flex gap-2">
              <img src={currentUser?.imageUrl || user.imageUrl} alt="profile" className="rounded-full w-12 h-12" />
              <div className="flex flex-col justify-start items-start">
                <p className="font-bold text-[16px]">{user.name}</p>
                <p className="text-[12px]">@{user.username}</p>
              </div>
            </Link>
          )}

          <Link to="/saved" onClick={onClose} className="text-primary-500 flex-center gap-2">
            <img src="/assets/icons/bookmark.svg" alt="saved" className="size-8" />
            <p className="text-amber-50">Saved</p>
          </Link>

          <div className="flex report-bug flex-center gap-2">
             <button 
            type="button" 
            onClick={() => setIsBugReportModalOpen(true)} 
            className="flex report-bug flex-center gap-2 cursor-pointer text-left w-full"
          >
            <img src="/assets/icons/bug-report.svg" alt="report a bug" className="size-8" />
            <p className="text-amber-50">report a bug</p>
          </button>
          </div>

          <div className="flex dark-mode flex-center gap-2">
            <img src="/assets/icons/dark-mode.svg" alt="change mode" className="size-8" />
            <p className="text-amber-50">dark mode</p>
          </div>

          <div className="logout cursor-pointer">
            <button type="button" className="flex flex-center gap-2 w-full h-full" onClick={() => setIsSignoutModalOpen(true)}>
              <img src="/assets/icons/logout.svg" alt="logout" className="cursor-pointer size-8" />
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