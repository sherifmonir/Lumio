import { useMutation } from '@tanstack/react-query'

import { createUserAccount, saveUserToDB, signinAccount, signoutAccount } from '../appwrite/api'
import type { INewUser } from '@/types'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })

}

export const useSigninAccount = () => {
    return useMutation({
        mutationFn: (user:{email:string, password:string}) => signinAccount(user)
    })

}

export const useSaveUserToDB = () => {
    return useMutation({
        mutationFn:(user: {
      accountId: string;
      email: string;
      name: string;
      imageUrl: string;
      username?: string;
    }) => saveUserToDB(user)
    })
}


export const useSignoutAccount = () => {
    return useMutation({
        mutationFn: signoutAccount
    })

}