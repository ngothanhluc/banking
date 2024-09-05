'use client'
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.action'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
    PlaidLinkOnSuccess,
    PlaidLinkOptions,
    usePlaidLink,
} from 'react-plaid-link'
import { Button } from './ui/button'
const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter()

    const [token, setToken] = useState(null)

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user)
            setToken(data?.linkToken)
        }
        getLinkToken()
    }, [user])

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token: string) => {
            await exchangePublicToken({ publicToken: public_token, user })
            router.push('/')
        },
        [user, router]
    )

    const config: PlaidLinkOptions = {
        onSuccess,
        token,
    }

    const { open, ready } = usePlaidLink(config)
    return (
        <>
            {variant === 'primary' ? (
                <Button
                    className="plaidlink-primary"
                    onClick={() => open()}
                    disabled={!ready}
                >
                    Connect Bank
                </Button>
            ) : variant === 'ghost' ? (
                <Button
                    onClick={() => open()}
                    variant="ghost"
                    className="plaidlink-ghost"
                >
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="connect bank"
                        width={24}
                        height={24}
                    />
                    <p className="hidden text-[16px] font-semibold text-black-2 xl:block">
                        Connect bank
                    </p>
                </Button>
            ) : (
                <Button onClick={() => open()} className="plaidlink-default">
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="connect bank"
                        width={24}
                        height={24}
                    />
                    <p className="text-[16px] font-semibold text-black-2">
                        Connect bank
                    </p>
                </Button>
            )}
        </>
    )
}

export default PlaidLink
