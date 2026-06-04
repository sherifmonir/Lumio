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
        <div className="bg-dark-3 flex items-center h-screen w-full ">
          <section className=" w-full h-full flex flex-col justify-around items-center gap-0 ">

            <img src="/assets/images/logo.svg" alt="logo" 
            className=" h-6 w-30 " />

            <Outlet />
            </section>

            <img
            src="/assets/images/side-img.svg"
            alt="Side Image"
            className=" h-screen w-full object-cover bg-no-repeat hidden md:block"
            />
        
        </div>
      ) 
       }
    </>
  )
}

export default AuthLayout