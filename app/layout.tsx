import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "FAVICON 데이터 포털",
    description: "FAVICON 데이터 포털 관리자 페이지",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ko">
        <body className={inter.className}>
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
        </body>
        </html>
    )
}
