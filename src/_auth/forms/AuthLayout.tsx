import {Outlet, Navigate} from 'react-router-dom'

const AuthLayout = () => {

  const isAuthenticated = false;

  
  return (
    <>
    {isAuthenticated ? 
      (
      <Navigate to="/" /> 
      ):

      (
        <div className="bg-dark-3 flex justify-center items-center  h-screen w-full flex-center overflow-y-auto gap-2">

          <section className="w-full  h-screen flex flex-col flex-center">

            <img src="/assets/images/logo.svg" alt="logo" 
            className="h-[30%]  w-40 m-auto" />

            <Outlet />
            </section>

            <img
            src="/assets/images/side-img.svg"
            alt="Side Image"
            className=" h-screen w-1/2 object-cover bg-no-repeat  hidden md:block"
            />
        
        </div>
      ) 
       }
    </>
  )
}

export default AuthLayout