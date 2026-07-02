import {Routes, Route} from 'react-router-dom'
import './globals.css'
import SignupForm from './_auth/forms/SignupForm'
import SigninForm from './_auth/forms/SigninForm'
import { AllUsers, CreatePost, EditPost, Explore, Home, LikedPosts, PostDetails, UpdateProfile } from './_root/Pages'
import AuthLayout from './_auth/forms/AuthLayout'
import RoutLayout from './_root/RoutLayout'
import { Toaster } from './components/ui/sonner'
import Saved from './_root/Pages/Saved'

const App = () => {
  return (
    <main >
      <Routes>
        {/*public routes*/}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>
        {/*private routes*/}
        <Route element={<RoutLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Route>
      </Routes>
      <Toaster />

    </main>
  )
}

export default App