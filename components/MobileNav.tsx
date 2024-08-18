"use client";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const MobileNav = ({ user }: MobileNavProps) => {
    const pathName = usePathname();
    return (
        <section className="w-full max-w-[264px]">
            <Sheet>
                <SheetTrigger>
                    <Image
                        src="/icons/hamburger.svg"
                        alt="menu"
                        width={30}
                        height={30}
                        className="cursor-pointer"
                    />
                </SheetTrigger>
                <SheetContent side="left" className="border-none bg-white">
                    <nav className="flex flex-col gap-4">
                        <Link
                            className="flex items-center cursor-pointer gap-1"
                            href="/"
                        >
                            <Image
                                src={"/icons/logo.svg"}
                                width={34}
                                height={34}
                                alt="Horizon Bank"
                                className="size-[24px] max-xl:size-14"
                            />
                            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                                Horizon
                            </h1>
                        </Link>
                        <div className="mobilenav-sheet">
                            <SheetClose asChild>
                                <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                                    {sidebarLinks.map((link) => {
                                        const isActive =
                                            pathName === link.route ||
                                            pathName.startsWith(
                                                `${link.route}/`
                                            );
                                        return (
                                            <SheetClose key={link.route}>
                                                <Link
                                                    key={link.route}
                                                    href={link.route}
                                                    className={cn(
                                                        "mobilenav-sheet_close w-full",
                                                        {
                                                            "bg-bankGradient":
                                                                isActive,
                                                        }
                                                    )}
                                                >
                                                    <Image
                                                        className={cn({
                                                            "brightness-[3] invert-0":
                                                                isActive,
                                                        })}
                                                        src={link.imgURL}
                                                        width={20}
                                                        height={20}
                                                        alt={link.label}
                                                    />
                                                    <p
                                                        className={cn(
                                                            "text-16 font-semibold text-black-2",
                                                            {
                                                                "!text-white":
                                                                    isActive,
                                                            }
                                                        )}
                                                    >
                                                        {link.label}
                                                    </p>
                                                </Link>
                                            </SheetClose>
                                        );
                                    })}
                                    USER
                                </nav>
                            </SheetClose>
                            FOOTER
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </section>
    );
};

export default MobileNav;
