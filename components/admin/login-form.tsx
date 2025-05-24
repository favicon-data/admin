"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await logout()
      toast({
        title: "로그아웃 성공",
        description: "성공적으로 로그아웃되었습니다.",
      })
      // 로그아웃 시 로그인 페이지로 이동
      router.push("/admin/login")
    } catch (error) {
      toast({
        title: "로그아웃 오류",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1"
            disabled={isLoading}
        >
          <LogOut className="h-4 w-4" />
          <span>로그아웃</span>
        </Button>
      </div>
  )
}
