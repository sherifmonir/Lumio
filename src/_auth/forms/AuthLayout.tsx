import {Outlet, Navigate} from 'react-router-dom'
import { useUserContext } from '@/context/UseUserContext'


 const AuthLayout = () => {
  
  
  const { isAuthenticated, isLoading } = useUserContext();
  if(isLoading) return null

  return (
    <>
    {isAuthenticated ? 
      (
      <Navigate to="/" /> 
      ):

      (
        <div className="bg-dark-3 flex h-screen  w-full flex-center overflow-auto gap-3">

          <section className="w-1/2  flex flex-col items-center h-screen">

            <img src="/assets/images/logo.svg" alt="logo" 
            className="h-20  w-60  mb-15 mt-35" />

            <div>
              <Outlet />
              </div>

            
            </section>

            <img
            src="/assets/images/side-img.svg"
            alt="Side Image"
            className="hidden h-full w-1/2 object-cover bg-no-repeat lg:block"
            />
        
        </div>
      ) 
       }
    </>
  )
}

export default AuthLayout