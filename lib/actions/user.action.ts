'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { ID } from 'node-appwrite'
import {
    CountryCode,
    ProcessorTokenCreateRequest,
    ProcessorTokenCreateRequestProcessorEnum,
    Products,
} from 'plaid'
import { createAdminClient, createSessionClient } from '../appwrite'
import { plaidClient } from '../plaid'
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils'
import { addFundingSource, createDwollaCustomer } from './dwolla.action'

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData
    let newUserAccount
    try {
        const { account, database } = await createAdminClient()
        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        )
        if (!newUserAccount) throw new Error('User account not created')
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal',
        })
        if (!dwollaCustomerUrl) throw new Error('Dwolla customer not created')
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl,
            }
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

export async function createLinkToken(user: User) {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth'] as Products[],
            country_codes: ['US'] as CountryCode[],
            language: 'en',
        }
        const createLinkTokenResponse =
            await plaidClient.linkTokenCreate(tokenParams)
        return parseStringify({
            linkToken: createLinkTokenResponse.data.link_token,
        })
    } catch (error) {
        return null
    }
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    sharableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient()
        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                sharableId,
            }
        )
        return parseStringify(bankAccount)
    } catch (error) {
        console.error('Error', error)
    }
}

export const exchangePublicToken = async (data: exchangePublicTokenProps) => {
    try {
        const { publicToken, user } = data
        const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange(
            {
                public_token: publicToken,
            }
        )
        const accessToken = exchangeTokenResponse.data.access_token
        const itemId = exchangeTokenResponse.data.item_id
        //Get account information from plaid use access token
        const accountResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        })
        const accountData = accountResponse.data.accounts[0]
        //Create a processor token for Dwolla using access token and account id

        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
        }
        const processorTokenResponse =
            await plaidClient.processorTokenCreate(request)
        const processorToken = processorTokenResponse.data.processor_token
        //Create a funding source using processor token
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        })
        //If funding source is created successfully, save the processor token and account id to the user
        if (!fundingSourceUrl) throw Error
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            sharableId: encryptId(accountData.account_id),
        })
        //Revalidate the path to update the user data
        revalidatePath('/')

        return parseStringify({ publicTokenExchange: 'complete' })
    } catch (error) {
        console.log('An error occurred when exchanging the public token', error)
    }
}
