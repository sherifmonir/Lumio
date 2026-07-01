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

          <section className="w-1/2 justify-around flex flex-col  h-screen">

            <img src="/assets/images/logo.svg" alt="logo" 
            className="h-10  w-20 mx-auto " />

            <div className=" w-40 m-auto">
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