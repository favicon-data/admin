"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { LoginForm } from "@/components/admin/login-form"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // 로그인 페이지에서는 리다이렉트 하지 않음
        if (pathname === "/admin/login") {
            return
        }

        // 로딩이 끝났고, 사용자가 없는 경우 로그인 페이지로 리다이렉트
        if (!isLoading && !user) {
            router.push("/admin/login")
        }
    }, [user, isLoading, router, pathname])

    // 로그인 페이지는 별도 레이아웃 사용
    if (pathname === "/admin/login") {
        return <>{children}</>
    }

    // 로딩 중이면 로딩 표시
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-800" />
                <span className="ml-2 text-lg">로딩 중...</span>
            </div>
        )
    }

    // 사용자가 없으면 렌더링하지 않음
    if (!user) {
        return null
    }

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <div className="border-b p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">홈</span>
                        <span className="text-sm text-muted-foreground">/</span>
                        <span className="text-sm text-muted-foreground">관리자</span>
                        <span className="text-sm text-muted-foreground">/</span>
                        <span className="text-sm text-muted-foreground">관리자 대시보드</span>
                    </div>
                    <LoginForm />
                </div>
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>
        </div>
    )
}
