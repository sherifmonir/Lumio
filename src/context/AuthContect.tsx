import { getCurrentUser } from '@/lib/appwrite/api'
import type {  IContextUser } from '@/types'
import { useEffect, useState} from 'react'
import {  INITIAL_USER, AuthContext } from './AuthConstants'


const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<IContextUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuthUser = async () => {
    setIsLoading(true)
    try{
      const currentAccount = await getCurrentUser()
      if(currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio
        })

        setIsAuthenticated(true)
        return true
      }
      return false

    } catch(error){
      console.log(error)
      return false
      
    } finally {
      setIsLoading(false)
    }
  }

  

  useEffect(() => {
    const checkAuth = async () => {

      const currentPath = window.location.pathname
      const isAuthPage = currentPath.includes('/sign-in') || currentPath.includes('/sign-up')

      if(isAuthPage) {

        setIsLoading(false)
        return

      }
      
      if(
  localStorage.getItem('cookieFallback') === '[]' ||
  localStorage.getItem('cookieFallback') === null
) {
  setIsAuthenticated(false)
  setIsLoading(false)
  return
}

      await checkAuthUser()
    }
    
    checkAuth()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


export default AuthProvider
