"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Eye, Plus, Search, Trash2, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface FAQ {
  faqId: number
  category: string
  question: string
  answer: string
}

// FAQ 카테고리 목록 (enum 값과 일치해야 함)
const FAQ_CATEGORIES = ["기타", "데이터라이선스", "문제해결", "서비스이용", "회원정보관리"]

// API 기본 URL
const API_BASE_URL = "http://54.180.238.119:8080"

export default function FaqManagement() {
  const { toast } = useToast()
  const { user, checkAdminStatus } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentFaq, setCurrentFaq] = useState<FAQ>({
    faqId: 0,
    category: "",
    question: "",
    answer: "",
  })

  // 관리자 권한 확인
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isAdminUser = await checkAdminStatus()
        console.log("관리자 권한 확인 결과:", isAdminUser)
        setIsAdmin(isAdminUser)
      } catch (error) {
        console.error("관리자 권한 확인 오류:", error)
        setIsAdmin(false)
      }
    }

    if (user) {
      checkAdmin()
    }
  }, [user, checkAdminStatus])

  // FAQ 목록 불러오기
  const fetchFAQs = async () => {
    try {
      setIsLoading(true)
      console.log("FAQ 목록 불러오는 중...")

      const response = await fetch(`${API_BASE_URL}/faq/list`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("FAQ 목록 불러오기 성공:", data)
      setFaqs(data)
    } catch (error) {
      console.error("FAQ 목록 불러오기 오류:", error)
      toast({
        title: "데이터 로드 오류",
        description: "FAQ 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFAQs()
  }, [])

  // 검색 필터링
  const filteredFaqs = faqs.filter(
      (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // FAQ 추가
  const handleAddFaq = async () => {
    if (!currentFaq.question || !currentFaq.answer || !currentFaq.category) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 관리자 권한 확인
    if (!isAdmin) {
      toast({
        title: "권한 오류",
        description: "FAQ를 추가할 권한이 없습니다. 관리자만 FAQ를 추가할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      console.log("FAQ 추가 중...", currentFaq)

      // 관리자 권한 재확인
      const adminCheck = await fetch(`${API_BASE_URL}/users/admin-check`, {
        method: "GET",
        credentials: "include",
      })

      if (!adminCheck.ok) {
        throw new Error("관리자 권한이 없습니다.")
      }

      const requestBody = {
        category: currentFaq.category,
        question: currentFaq.question,
        answer: currentFaq.answer,
      }

      console.log("FAQ 추가 요청 데이터:", requestBody)

      const response = await fetch(`${API_BASE_URL}/faq/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("FAQ 추가 성공:", data)

      toast({
        title: "FAQ 추가 성공",
        description: "FAQ가 성공적으로 추가되었습니다.",
      })

      // 다이얼로그 닫기
      setDialogOpen(false)

      // 폼 초기화
      resetForm()

      // FAQ 목록 새로고침
      fetchFAQs()
    } catch (error) {
      console.error("FAQ 추가 오류:", error)
      toast({
        title: "FAQ 추가 오류",
        description: "FAQ를 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // FAQ 수정
  const handleUpdateFaq = async () => {
    if (!currentFaq.question || !currentFaq.answer || !currentFaq.category) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    // 관리자 권한 확인
    if (!isAdmin) {
      toast({
        title: "권한 오류",
        description: "FAQ를 수정할 권한이 없습니다. 관리자만 FAQ를 수정할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      console.log("FAQ 수정 중...", currentFaq)

      // 관리자 권한 재확인
      const adminCheck = await fetch(`${API_BASE_URL}/users/admin-check`, {
        method: "GET",
        credentials: "include",
      })

      if (!adminCheck.ok) {
        throw new Error("관리자 권한이 없습니다.")
      }

      const requestBody = {
        category: currentFaq.category,
        question: currentFaq.question,
        answer: currentFaq.answer,
      }

      console.log("FAQ 수정 요청 데이터:", requestBody)

      const response = await fetch(`${API_BASE_URL}/faq/${currentFaq.faqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("FAQ 수정 성공:", data)

      toast({
        title: "FAQ 수정 성공",
        description: "FAQ가 성공적으로 수정되었습니다.",
      })

      // 다이얼로그 닫기
      setDialogOpen(false)

      // 폼 초기화
      resetForm()

      // FAQ 목록 새로고침
      fetchFAQs()
    } catch (error) {
      console.error("FAQ 수정 오류:", error)
      toast({
        title: "FAQ 수정 오류",
        description: "FAQ를 수정하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // FAQ 삭제
  const handleDeleteFaq = async (faqId: number) => {
    // 관리자 권한 확인
    if (!isAdmin) {
      toast({
        title: "권한 오류",
        description: "FAQ를 삭제할 권한이 없습니다. 관리자만 FAQ를 삭제할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      console.log("FAQ 삭제 중...", faqId)

      // 관리자 권한 재확인
      const adminCheck = await fetch(`${API_BASE_URL}/users/admin-check`, {
        method: "GET",
        credentials: "include",
      })

      if (!adminCheck.ok) {
        throw new Error("관리자 권한이 없습니다.")
      }

      const response = await fetch(`${API_BASE_URL}/faq/${faqId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      console.log("FAQ 삭제 성공")

      toast({
        title: "FAQ 삭제 성공",
        description: "FAQ가 성공적으로 삭제되었습니다.",
      })

      // FAQ 목록 새로고침
      fetchFAQs()
    } catch (error) {
      console.error("FAQ 삭제 오류:", error)
      toast({
        title: "FAQ 삭제 오류",
        description: "FAQ를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditFaq = (faq: FAQ) => {
    console.log("FAQ 수정 모드:", faq)
    setCurrentFaq(faq)
    setEditMode(true)
    setDialogOpen(true)
  }

  const handleAddNewFaq = () => {
    resetForm()
    setEditMode(false)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setCurrentFaq({
      faqId: 0,
      category: "",
      question: "",
      answer: "",
    })
    setEditMode(false)
  }

  // 답변 텍스트 줄임 처리
  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">자주 묻는 질문 관리</h1>
          {!isAdmin && (
              <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">관리자 권한이 필요합니다</span>
              </div>
          )}
          <Button className="bg-green-800 hover:bg-green-900" onClick={handleAddNewFaq} disabled={!isAdmin}>
            <Plus className="mr-2 h-4 w-4" />
            FAQ 추가
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
              placeholder="FAQ 검색..."
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
                <TableHead>질문</TableHead>
                <TableHead>답변</TableHead>
                <TableHead>카테고리</TableHead>
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
              ) : filteredFaqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredFaqs.map((item) => (
                      <TableRow key={item.faqId} className="hover:bg-green-50">
                        <TableCell>{item.faqId}</TableCell>
                        <TableCell className="font-medium max-w-[250px] truncate">{item.question}</TableCell>
                        <TableCell className="max-w-[250px] truncate">{truncateText(item.answer)}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                  <DialogTitle>FAQ 상세</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">질문</h3>
                                    <p>{item.question}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">답변</h3>
                                    <p className="whitespace-pre-wrap">{item.answer}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">카테고리</h3>
                                    <p>{item.category}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="icon" onClick={() => handleEditFaq(item)} disabled={!isAdmin}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" disabled={!isAdmin}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>FAQ 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말로 이 FAQ를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                      onClick={() => handleDeleteFaq(item.faqId)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={isProcessing || !isAdmin}
                                  >
                                    {isProcessing ? (
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

        {/* FAQ 추가/수정 다이얼로그 */}
        <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}
        >
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "FAQ 수정" : "새 FAQ 추가"}</DialogTitle>
              <DialogDescription>
                {editMode ? "기존 FAQ를 수정합니다." : "데이터 포털에 새로운 FAQ를 추가합니다."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question" className="text-right">
                  질문
                </Label>
                <Input
                    id="question"
                    value={currentFaq.question}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                    className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="answer" className="text-right">
                  답변
                </Label>
                <Textarea
                    id="answer"
                    value={currentFaq.answer}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                    className="col-span-3 min-h-[150px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  카테고리
                </Label>
                <Select
                    value={currentFaq.category}
                    onValueChange={(value) => setCurrentFaq({ ...currentFaq, category: value })}
                >
                  <SelectTrigger id="category" className="col-span-3">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                  type="submit"
                  onClick={editMode ? handleUpdateFaq : handleAddFaq}
                  className="bg-green-800 hover:bg-green-900"
                  disabled={isProcessing || !isAdmin}
              >
                {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                ) : editMode ? (
                    "수정"
                ) : (
                    "저장"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
