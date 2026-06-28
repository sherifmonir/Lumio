import { useContext } from 'react'
import { AuthContext } from './AuthConstants'

export const useUserContext = () => useContext(AuthContext)