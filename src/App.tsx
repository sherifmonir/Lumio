import {Routes, Route} from 'react-router-dom'
import type { ComponentType } from 'react'
import './globals.css'
import SignupForm from './_auth/forms/SignupForm'
import SigninForm from './_auth/forms/SigninForm'
import {  CreatePost, EditPost, Explore, Home, LikedPosts, PostDetails } from './_root/Pages'
import AuthLayout from './_auth/forms/AuthLayout'
import RoutLayout from './_root/RoutLayout'
import { Toaster } from './components/ui/sonner'
import Saved from './_root/Pages/Saved'
import Profile from './_root/Pages/Profile'
import EditProfile from './_root/Pages/EditProfile'
import People from './_root/Pages/People'

const RouteWrapper = RoutLayout as ComponentType
const UpdateProfileFormWrapper = EditProfile as ComponentType

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
        <Route element={<RouteWrapper />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/people" element={<People />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/edit-profile/:id" element={<UpdateProfileFormWrapper />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Route>
      </Routes>
      <Toaster />

    </main>
  )
}

export default App