"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react"

export default function AnnouncementsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [editMode, setEditMode] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    id: "",
    title: "",
    content: "",
    date: "",
    important: false,
  })

  const filteredAnnouncements = announcements.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddOrUpdateAnnouncement = () => {
    if (editMode) {
      setAnnouncements(announcements.map((item) => (item.id === currentAnnouncement.id ? currentAnnouncement : item)))
    } else {
      const currentDate = new Date().toISOString().split("T")[0]
      setAnnouncements([
        ...announcements,
        {
          id: (announcements.length + 1).toString(),
          title: currentAnnouncement.title,
          content: currentAnnouncement.content,
          date: currentDate,
          important: currentAnnouncement.important,
        },
      ])
    }
    resetForm()
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((item) => item.id !== id))
  }

  const handleEditAnnouncement = (announcement: typeof currentAnnouncement) => {
    setCurrentAnnouncement(announcement)
    setEditMode(true)
  }

  const resetForm = () => {
    setCurrentAnnouncement({
      id: "",
      title: "",
      content: "",
      date: "",
      important: false,
    })
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">공지사항 관리</h1>
        <Dialog onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              공지사항 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editMode ? "공지사항 수정" : "새 공지사항 추가"}</DialogTitle>
              <DialogDescription>
                {editMode ? "기존 공지사항을 수정합니다." : "데이터 포털에 새로운 공지사항을 추가합니다."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  제목
                </Label>
                <Input
                  id="title"
                  value={currentAnnouncement.title}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  내용
                </Label>
                <Textarea
                  id="content"
                  value={currentAnnouncement.content}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                  className="col-span-3 min-h-[150px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="important" className="text-right">
                  중요 공지
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <input
                    type="checkbox"
                    id="important"
                    checked={currentAnnouncement.important}
                    onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, important: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="important" className="text-sm font-normal">
                    중요 공지로 표시
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddOrUpdateAnnouncement}>
                {editMode ? "수정" : "저장"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="공지사항 검색..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnouncements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredAnnouncements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.important && <Badge variant="destructive">중요</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog onOpenChange={(open) => !open && resetForm()}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleEditAnnouncement(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>공지사항 수정</DialogTitle>
                            <DialogDescription>기존 공지사항을 수정합니다.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-title" className="text-right">
                                제목
                              </Label>
                              <Input
                                id="edit-title"
                                value={currentAnnouncement.title}
                                onChange={(e) =>
                                  setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-content" className="text-right">
                                내용
                              </Label>
                              <Textarea
                                id="edit-content"
                                value={currentAnnouncement.content}
                                onChange={(e) =>
                                  setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })
                                }
                                className="col-span-3 min-h-[150px]"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-important" className="text-right">
                                중요 공지
                              </Label>
                              <div className="flex items-center space-x-2 col-span-3">
                                <input
                                  type="checkbox"
                                  id="edit-important"
                                  checked={currentAnnouncement.important}
                                  onChange={(e) =>
                                    setCurrentAnnouncement({ ...currentAnnouncement, important: e.target.checked })
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="edit-important" className="text-sm font-normal">
                                  중요 공지로 표시
                                </Label>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleAddOrUpdateAnnouncement}>
                              수정
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>공지사항 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAnnouncement(item.id)}>
                              삭제
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

const initialAnnouncements = [
  {
    id: "1",
    title: "데이터 포털 서비스 개편 안내",
    content: "안녕하세요. 데이터 포털 서비스가 개편되었습니다. 더 나은 서비스를 제공하기 위해 노력하겠습니다.",
    date: "2023-12-20",
    important: true,
  },
  {
    id: "2",
    title: "2024년 데이터 공개 일정 안내",
    content: "2024년 데이터 공개 일정을 안내드립니다. 자세한 내용은 본문을 참고해주세요.",
    date: "2023-12-15",
    important: false,
  },
  {
    id: "3",
    title: "데이터 요청 게시판 이용 안내",
    content: "데이터 요청 게시판 이용 방법에 대해 안내드립니다.",
    date: "2023-11-30",
    important: false,
  },
  {
    id: "4",
    title: "개인정보 처리방침 개정 안내",
    content: "개인정보 처리방침이 개정되었습니다. 자세한 내용은 본문을 참고해주세요.",
    date: "2023-11-15",
    important: true,
  },
  {
    id: "5",
    title: "서버 점검 안내",
    content: "서버 점검으로 인해 일시적으로 서비스 이용이 제한될 수 있습니다.",
    date: "2023-10-25",
    important: false,
  },
]
