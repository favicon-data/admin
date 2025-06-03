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
    username: string
}

const API_BASE_URL = "http://54.180.238.119:8080"

export default function UsersManagement() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingUserId, setProcessingUserId] = useState<number | null>(null)

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_BASE_URL}/statistics/all-user`, {
                method: "GET",
                credentials: "include",
            })

            if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)

            const json = await response.json()
            const data: User[] = json.data.map((item: any[]) => ({
                userId: item[0],
                email: item[1],
                username: item[2],
            }))

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

    const filteredUsers = users.filter(
        (item) =>
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleDeleteUser = async (userId: number) => {
        try {
            setProcessingUserId(userId)
            setIsProcessing(true)

            const response = await fetch(`${API_BASE_URL}/users/delete-account/${userId}`, {
                method: "DELETE",
                credentials: "include",
            })

            if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)

            const result = await response.json()
            toast({
                title: "사용자 삭제 성공",
                description: result.message || "사용자가 성공적으로 삭제되었습니다.",
            })

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
                    <p className="text-muted-foreground">시스템에 등록된 사용자를 관리합니다.</p>
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
                            <TableHead className="text-right">작업</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-green-800 mr-2" />
                                        데이터를 불러오는 중...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    검색 결과가 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((item) => (
                                <TableRow key={item.userId} className="hover:bg-green-50">
                                    <TableCell>{item.userId}</TableCell>
                                    <TableCell className="font-medium">{item.email}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-red-600 border-red-200"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" /> 삭제
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며 현재 로그인된 사용자의 계정만 삭제됩니다.
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
