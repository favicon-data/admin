"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Trash2, Loader2, UserCog } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface User {
    userId: number
    email: string
    username: string | null
    role: number
}

// API 기본 URL
const API_BASE_URL = "http://54.180.238.119:8080"

export default function UsersManagement() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingUserId, setProcessingUserId] = useState<number | null>(null)

    // 사용자 목록 불러오기
    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            console.log("사용자 목록 불러오는 중...")

            const response = await fetch(`${API_BASE_URL}/users/list`, {
                method: "GET",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`)
            }

            const data = await response.json()
            console.log("사용자 목록 불러오기 성공:", data)
            setUsers(data)
        } catch (error) {
            console.error("사용자 목록 불러오기 오류:", error)
            toast({
                title: "데이터 로드 오류",
                description: "사용자 목록을 불러오는 중 오류가 발생했습니다.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // 검색 필터링
    const filteredUsers = users.filter(
        (item) =>
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.username && item.username.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    // 사용자 삭제
    const handleDeleteUser = async (userId: number) => {
        try {
            setProcessingUserId(userId)
            setIsProcessing(true)
            console.log("사용자 삭제 중...", userId)

            const response = await fetch(`${API_BASE_URL}/users/delete-account/${userId}`, {
                method: "DELETE",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`)
            }

            const data = await response.json()
            console.log("사용자 삭제 성공:", data)

            toast({
                title: "사용자 삭제 성공",
                description: "사용자가 성공적으로 삭제되었습니다.",
            })

            // 사용자 목록 새로고침
            fetchUsers()
        } catch (error) {
            console.error("사용자 삭제 오류:", error)
            toast({
                title: "사용자 삭제 오류",
                description: "사용자를 삭제하는 중 오류가 발생했습니다.",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
            setProcessingUserId(null)
        }
    }

    // 사용자 역할 표시
    const getUserRoleBadge = (role: number) => {
        if (role === 1) {
            return <Badge className="bg-green-100 text-green-800 border-green-200">관리자</Badge>
        } else {
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    일반 사용자
                </Badge>
            )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
                    <p className="text-muted-foreground">시스템에 등록된 사용자를 관리합니다.</p>
                </div>
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-md">
                    <UserCog className="h-4 w-4 mr-2" />
                    <span className="text-sm">관리자 모드</span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="사용자 검색..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-green-50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>사용자명</TableHead>
                            <TableHead>역할</TableHead>
                            <TableHead className="text-right">작업</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-green-800 mr-2" />
                                        데이터를 불러오는 중...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((item) => (
                                <TableRow key={item.userId} className="hover:bg-green-50">
                                    <TableCell>{item.userId}</TableCell>
                                    <TableCell className="font-medium">{item.email}</TableCell>
                                    <TableCell>{item.username || "-"}</TableCell>
                                    <TableCell>{getUserRoleBadge(item.role)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200">
                                                        <Trash2 className="h-4 w-4 mr-1" /> 삭제
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 사용자의 모든 데이터가
                                                            삭제됩니다.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>취소</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteUser(item.userId)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                            disabled={isProcessing && processingUserId === item.userId}
                                                        >
                                                            {isProcessing && processingUserId === item.userId ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    처리 중...
                                                                </>
                                                            ) : (
                                                                "삭제"
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
