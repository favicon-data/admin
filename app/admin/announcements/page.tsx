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
import { Edit, Plus, Eye, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Notice {
  noticeId: number
  title: string
  content: string
  label: string
  createDate: string
  view: number
}

const NOTICE_LABELS = ["일반", "중요", "업데이트"]

const labelColorMap: Record<string, string> = {
  일반: "bg-green-100 text-green-800",
  중요: "bg-red-100 text-red-800",
  업데이트: "bg-yellow-100 text-yellow-800",
}

const API_BASE_URL = "http://54.180.238.119:8080"

export default function NoticeManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentNotice, setCurrentNotice] = useState<Notice>({
    noticeId: 0,
    title: "",
    content: "",
    label: "",
    createDate: "",
    view: 0,
  })

  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewNotice, setViewNotice] = useState<Notice | null>(null)

  const fetchNotices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/notice/list`, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)
      const data = await response.json()
      setNotices(data.data)
    } catch (error) {
      toast({
        title: "데이터 로드 오류",
        description: "공지사항 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const filteredNotices = notices.filter(
      (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )


  const handleAddNotice = async () => {
    if (!currentNotice.title || !currentNotice.content || !currentNotice.label) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsProcessing(true)

      const requestBody = {
        title: currentNotice.title,
        content: currentNotice.content,
        label: currentNotice.label,
      }

      const response = await fetch(`${API_BASE_URL}/notice/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      })
      if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)

      toast({
        title: "공지사항 추가 성공",
        description: "공지사항이 성공적으로 추가되었습니다.",
      })
      setDialogOpen(false)
      resetForm()
      fetchNotices()
    } catch (error) {
      toast({
        title: "공지사항 추가 오류",
        description: "공지사항을 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateNotice = async () => {
    if (!currentNotice.title || !currentNotice.content || !currentNotice.label) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsProcessing(true)

      const requestBody = {
        title: currentNotice.title,
        content: currentNotice.content,
        label: currentNotice.label,
      }

      const response = await fetch(`${API_BASE_URL}/notice/${currentNotice.noticeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      })
      if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)

      toast({
        title: "공지사항 수정 성공",
        description: "공지사항이 성공적으로 수정되었습니다.",
      })
      setDialogOpen(false)
      resetForm()
      fetchNotices()
    } catch (error) {
      toast({
        title: "공지사항 수정 오류",
        description: "공지사항을 수정하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteNotice = async (noticeId: number) => {
    try {
      setIsProcessing(true)

      const response = await fetch(`${API_BASE_URL}/notice/${noticeId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`)

      toast({
        title: "공지사항 삭제 성공",
        description: "공지사항이 성공적으로 삭제되었습니다.",
      })
      fetchNotices()
    } catch (error) {
      toast({
        title: "공지사항 삭제 오류",
        description: "공지사항을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditNotice = (notice: Notice) => {
    setCurrentNotice(notice)
    setEditMode(true)
    setDialogOpen(true)
  }

  const handleAddNewNotice = () => {
    resetForm()
    setEditMode(false)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setCurrentNotice({
      noticeId: 0,
      title: "",
      content: "",
      label: "",
      createDate: "",
      view: 0,
    })
    setEditMode(false)
  }

  const handleViewNotice = (notice: Notice) => {
    setViewNotice(notice)
    setViewDialogOpen(true)
  }

  const truncateText = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">공지사항 관리</h1>

          <Button className="bg-green-800 hover:bg-green-900" onClick={handleAddNewNotice}>
            <Plus className="mr-2 h-4 w-4" />
            공지사항 추가
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Input
              placeholder="공지사항 검색..."
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
                <TableHead>제목</TableHead>
                <TableHead>내용</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>작성일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin text-green-800 mr-2" />
                        데이터를 불러오는 중...
                      </div>
                    </TableCell>
                  </TableRow>
              ) : filteredNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredNotices.map((notice) => (
                      <TableRow key={notice.noticeId}>
                        <TableCell>{notice.noticeId}</TableCell>
                        <TableCell>{notice.title}</TableCell>
                        <TableCell>{truncateText(notice.content, 50)}</TableCell>
                        <TableCell>
                    <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                            labelColorMap[notice.label] || "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {notice.label}
                    </span>
                        </TableCell>
                        <TableCell>{notice.createDate}</TableCell>
                        <TableCell className="text-right space-x-2">
                          {/* 보기 버튼 - 초록색으로 변경 */}
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-green-700"
                              onClick={() => handleViewNotice(notice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* 수정 버튼 - 파란색으로 변경 */}
                          <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-700"
                              onClick={() => handleEditNotice(notice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {/* 삭제 버튼 (기존 유지) */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={isProcessing} className="text-red-600">
                                <Trash2 className="h-4 w-4 fill-none" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  선택한 공지사항을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteNotice(notice.noticeId)}>
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 공지사항 추가/수정 모달 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editMode ? "공지사항 수정" : "공지사항 추가"}</DialogTitle>
              <DialogDescription>
                {editMode
                    ? "공지사항 내용을 수정 후 저장 버튼을 눌러주세요."
                    : "새로운 공지사항 내용을 입력 후 저장 버튼을 눌러주세요."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="title">제목</Label>
                <Input
                    id="title"
                    value={currentNotice.title}
                    onChange={(e) => setCurrentNotice({ ...currentNotice, title: e.target.value })}
                    placeholder="제목을 입력하세요"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="content">내용</Label>
                <Textarea
                    id="content"
                    value={currentNotice.content}
                    onChange={(e) => setCurrentNotice({ ...currentNotice, content: e.target.value })}
                    placeholder="내용을 입력하세요"
                    rows={5}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="label">카테고리</Label>
                <Select
                    onValueChange={(value) => setCurrentNotice({ ...currentNotice, label: value })}
                    value={currentNotice.label}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTICE_LABELS.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    resetForm()
                  }}
              >
                취소
              </Button>
              <Button
                  type="button"
                  onClick={editMode ? handleUpdateNotice : handleAddNotice}
                  disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 새로 추가: 공지사항 내용 보기 모달 */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{viewNotice?.title}</DialogTitle>
              <DialogDescription>
                작성일: {viewNotice?.createDate} | 조회수: {viewNotice?.view}
              </DialogDescription>
            </DialogHeader>
            <div className="py-2 whitespace-pre-wrap">{viewNotice?.content}</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
