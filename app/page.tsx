"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { AuthProvider } from "@/contexts/auth-context"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  return (
      <AuthProvider>
        <HomeContent />
      </AuthProvider>
  )
}

function HomeContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 로딩이 끝나고 사용자가 로그인되어 있으면 관리자 페이지로 리다이렉트
    if (!isLoading && user) {
      router.push("/admin")
    } else if (!isLoading && !user) {
      // 로그인되어 있지 않으면 관리자 로그인 페이지로 리다이렉트
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-800" />
          <span className="ml-2 text-lg">로딩 중...</span>
        </div>
    )
  }

  return null
}
