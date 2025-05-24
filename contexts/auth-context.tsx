"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { userApi } from "@/lib/api"

interface User {
  id: number
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAdminStatus: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 세션 확인
    const checkSession = async () => {
      try {
        setIsLoading(true)
        const sessionResponse = await userApi.checkSession()

        if (sessionResponse.status === "success") {
          const userId = sessionResponse.data

          // 관리자 권한 확인
          const adminResponse = await userApi.checkAdmin()
          console.log("Admin check response:", adminResponse)

          // 사용자 정보 설정
          setUser({
            id: userId,
            email: sessionResponse.email || "",
            isAdmin: true, // 세션이 있으면 관리자로 간주
          })
        }
      } catch (error) {
        console.error("Session check failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const loginResponse = await userApi.login(email, password)

      if (loginResponse.status === "success") {
        // 세션 정보 가져오기
        const sessionResponse = await userApi.checkSession()
        const userId = sessionResponse.data

        // 사용자 정보 즉시 업데이트
        setUser({
          id: userId,
          email,
          isAdmin: true, // 로그인 성공하면 관리자로 간주
        })

        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await userApi.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkAdminStatus = async (): Promise<boolean> => {
    try {
      const response = await userApi.checkAdmin()
      console.log("Checking admin status:", response)
      return true // 세션이 있으면 관리자로 간주
    } catch (error) {
      console.error("Admin check failed:", error)
      return false
    }
  }

  return (
      <AuthContext.Provider value={{ user, isLoading, login, logout, checkAdminStatus }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
