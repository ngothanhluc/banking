import { cookies } from 'next/headers'
import { Account, Client, Databases, Users } from 'node-appwrite' // Using the server SDK

export const createSessionClient = async () => {
    const sessionClient = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!) // Your project ID
    const session = cookies().get('appwrite-session') // Get the session cookie from the request
    if (!session || !session.value) {
        throw new Error('Session cookie not found')
    } else {
        sessionClient.setSession(session.value)
    }
    return {
        get account() {
            return new Account(sessionClient)
        },
    }
}

export const createAdminClient = async () => {
    const adminClient = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!) // Your project ID
        .setKey(process.env.NEXT_APPWRITE_API_KEY!)
    return {
        get account() {
            return new Account(adminClient)
        },
        get database() {
            return new Databases(adminClient)
        },
        get user() {
            return new Users(adminClient)
        },
    }
}
