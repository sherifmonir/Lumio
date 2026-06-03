import {Outlet, Navigate} from 'react-router-dom'

const AuthLayout = () => {

  const isAuthenticated = false; // Replace with actual authentication logic

  
  return (
    <>
    {isAuthenticated ? 
      (
      <Navigate to="/" /> 
      ):

      (
        <div className="bg-dark-3 flex justify-between h-screen w-full ">
          <section className="flex flex-col justify-center items-center  p-4 mx-auto">

            <img src="/assets/images/logo.svg" alt="logo" className="my-4 size-30" />

            <Outlet />
            </section>

            <img
            src="/assets/images/side-img.svg"
            alt="Side Image"
            className="h-screen w-1/2 object-cover bg-no-repeat hidden lg:block"
            />
        
        </div>
      ) 
       }
    </>
  )
}

export default AuthLayout