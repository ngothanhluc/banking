'use server'

import { cookies } from 'next/headers'
import { ID } from 'node-appwrite'
import { createAdminClient, createSessionClient } from '../appwrite'
import { parseStringify } from '../utils'

export const signUp = async (userData: SignUpParams) => {
    try {
        const { email, password, firstName, lastName } = userData
        const { account } = await createAdminClient()
        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        )
        const session = await account.createEmailPasswordSession(
            email,
            password
        )
        cookies().set('appwrite-session', session.secret, {
            // use the session secret as the cookie value
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        })
        return parseStringify(newUserAccount)
    } catch (error) {
        console.error('Error', error)
    }
}
export const signIn = async (data: LoginUser) => {
    try {
        const { email, password } = data
        const { account } = await createAdminClient()
        const session = await account.createEmailPasswordSession(
            email,
            password
        )
        cookies().set('appwrite-session', session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        })
        return parseStringify(session)
    } catch (error) {
        console.error('Error', error)
    }
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient()
        const result = await account.get()

        return parseStringify(result)
    } catch (error) {
        console.log(error)
        return null
    }
}
export async function logoutAccount() {
    try {
        const { account } = await createSessionClient()
        cookies().delete('appwrite-session')
        return await account.deleteSession('current')
    } catch (error) {
        return null
    }
}
