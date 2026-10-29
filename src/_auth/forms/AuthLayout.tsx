import {Outlet, Navigate} from 'react-router-dom'
import { useUserContext } from '@/context/UseUserContext'
import { useEffect, useState } from 'react'


 const AuthLayout = () => {
  
  
  const { isAuthenticated, isLoading } = useUserContext()
  const [showSideImage, setShowSideImage] = useState(() =>
    window.matchMedia('(min-width: 64rem)').matches
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 64rem)')
    const updateVisibility = () => setShowSideImage(mediaQuery.matches)

    mediaQuery.addEventListener('change', updateVisibility)
    return () => mediaQuery.removeEventListener('change', updateVisibility)
  }, [])

  if(isLoading) return null

  return (
    <>
    {isAuthenticated ? 
      (
      <Navigate to="/" /> 
      ):

      (
        <div className="bg-background flex h-screen  w-full flex-center overflow-auto gap-3">

          <section className="w-1/2  flex flex-col items-center h-screen">

            <img src="/assets/images/logo.svg" alt="logo" 
            className="h-20  w-60  mb-15 mt-35" />

            <div>
              <Outlet />
            </div>

            
            </section>

            {showSideImage && (
              <img
                src="/assets/images/side-img.webp"
                alt="Side Image"
                width={720}
                height={1024}
                fetchPriority="high"
                className="hidden h-full w-1/2 object-cover bg-no-repeat lg:block"
              />
            )}
        
        </div>
      ) 
       }
    </>
  )
}

export default AuthLayout