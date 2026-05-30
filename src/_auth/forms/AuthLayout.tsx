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
        <>
        <section className='flex flex-1 justify-center items-center flex-col py-10'>
          <Outlet />
        </section>
        <img
        src="/assets/images/side-img.svg"
        alt="Side image"
        className="xl:block lg:block md:block sm:hidden xs:hidden h-screen w-1/2 object-cover bg-no-repeat"
        />
        </>
      ) 
       }
    </>
  )
}

export default AuthLayout