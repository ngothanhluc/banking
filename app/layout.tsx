import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-ibm-plex-serif",
});
export const metadata: Metadata = {
    title: "Horizon",
    description:
        "Horizon is a personal finance app that helps you track your spending and save money. It's easy to use and free to download. Get started today!",

    icons: {
        icon: "/icons/icon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
                {children}
            </body>
        </html>
    );
}
