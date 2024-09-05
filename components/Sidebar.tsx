'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Footer from './Footer'
import PlaidLink from './PlaidLink'

const Sidebar = ({ user }: SidebarProps) => {
    const pathName = usePathname()

    return (
        <section className="sidebar">
            <nav className="flex flex-col gap-4">
                <Link className="flex items-center justify-center" href="/">
                    <Image
                        src={'/icons/logo.svg'}
                        width={34}
                        height={34}
                        alt="Horizon Bank"
                        className="size-[24px] max-xl:size-14"
                    />
                    <p className="sidebar-logo">Horizon</p>
                </Link>
                {sidebarLinks.map((link) => {
                    const isActive =
                        pathName === link.route ||
                        pathName.startsWith(`${link.route}/`)
                    return (
                        <Link
                            key={link.route}
                            href={link.route}
                            className={cn('sidebar-link', {
                                'bg-bankGradient': isActive,
                            })}
                        >
                            <div className="relative size-6">
                                <Image
                                    className={cn({
                                        'brightness-[3] invert-0': isActive,
                                    })}
                                    src={link.imgURL}
                                    fill
                                    alt={link.label}
                                />
                            </div>
                            <p
                                className={cn('sidebar-label', {
                                    '!text-white': isActive,
                                })}
                            >
                                {link.label}
                            </p>
                        </Link>
                    )
                })}
                <PlaidLink user={user} variant="ghost" dwollaCustomerId="" />
            </nav>
            <Footer user={user} type="mobile" />
        </section>
    )
}

export default Sidebar
