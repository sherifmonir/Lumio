import {Routes, Route} from 'react-router-dom'
import './globals.css'
import SignupForm from './_auth/forms/SignupForm'
import SigninForm from './_auth/forms/SigninForm'
import { Home } from './_root/Pages'
import AuthLayout from './_auth/forms/AuthLayout'
import RoutLayout from './_root/Pages/RoutLayout'


const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/*public routes*/}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>
        {/*private routes*/}
        <Route element={<RoutLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>

    </main>
  )
}

export default App