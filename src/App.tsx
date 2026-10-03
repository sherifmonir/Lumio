import {Routes, Route} from 'react-router-dom'
import { lazy, Suspense, type ComponentType } from 'react'
import './globals.css'
import AuthLayout from './_auth/forms/AuthLayout'
import RoutLayout from './_root/RoutLayout'
import { Toaster } from './components/ui/Toast'

const SigninForm = lazy(() => import('./_auth/forms/SigninForm'))
const SignupForm = lazy(() => import('./_auth/forms/SignupForm'))

const Home = lazy(() => import('./_root/Pages').then((m) => ({ default: m.Home })))
const Explore = lazy(() => import('./_root/Pages').then((m) => ({ default: m.Explore })))
const CreatePost = lazy(() => import('./_root/Pages').then((m) => ({ default: m.CreatePost })))
const EditPost = lazy(() => import('./_root/Pages').then((m) => ({ default: m.EditPost })))
const PostDetails = lazy(() => import('./_root/Pages').then((m) => ({ default: m.PostDetails })))
const UpdateProfile = lazy(() => import('./_root/Pages').then((m) => ({ default: m.UpdateProfile })))
const LikedPosts = lazy(() => import('./_root/Pages').then((m) => ({ default: m.LikedPosts })))


const Saved = lazy(() => import('./_root/Pages/Saved'))
const Profile = lazy(() => import('./_root/Pages/Profile'))
const People = lazy(() => import('./_root/Pages/People'))
const FollowList = lazy(() => import('./_root/Pages/FollowList'))

const RouteWrapper = RoutLayout as ComponentType
const UpdateProfileFormWrapper = UpdateProfile as ComponentType

const PageLoader = () => (
  <div className="flex-center w-full h-full min-h-[400px]">
    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

const App = () => {
  return (
    <main >
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/update-profile/:id" element={<UpdateProfileFormWrapper />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/profile/:id/followers" element={<FollowList />} />
          <Route path="/profile/:id/following" element={<FollowList />} />
          <Route path="/LikedPosts" element={<LikedPosts />} />
        </Route>
      </Routes>
      <Toaster />
      </Suspense>
    </main>
  )
}

export default App