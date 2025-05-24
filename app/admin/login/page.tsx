"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Database } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLoginPage() {
    const { login } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast({
                title: "입력 오류",
                description: "이메일과 비밀번호를 모두 입력해주세요.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const success = await login(email, password)

            if (success) {
                toast({
                    title: "로그인 성공",
                    description: "FAVICON 관리자 페이지에 오신 것을 환영합니다.",
                })
                router.push("/admin")
            } else {
                toast({
                    title: "로그인 실패",
                    description: "이메일 또는 비밀번호가 올바르지 않습니다.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "로그인 오류",
                description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-green-50">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Database className="h-6 w-6 text-green-800" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-green-800">FAVICON 관리자</h2>
                    <p className="mt-2 text-sm text-green-700">데이터 포털 관리자 페이지에 로그인하세요</p>
                </div>
                <div className="mt-8 bg-white p-8 shadow-md rounded-lg">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium">
                                이메일
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                placeholder="관리자 이메일을 입력하세요"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium">
                                비밀번호
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                                placeholder="비밀번호를 입력하세요"
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-green-800 hover:bg-green-900 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        로그인 중...
                                    </>
                                ) : (
                                    "로그인"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
