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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Eye, Search, XCircle, Loader2, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// 요청 상태 타입
type RequestStatus = "PENDING" | "APPROVED" | "REJECTED"

// 요청 데이터 타입
interface DataRequest {
  dataRequestId: number
  user: {
    userId: number
    email: string
    username: string | null
    password: string
    role: number
  }
  purpose: string
  title: string
  content: string
  uploadDate: string
  fileUrl: string | null
  reviewStatus: RequestStatus
  reviewedBy: number | null
  reviewDate: string | null
  organization: string
  userId: number
  response?: string
}

// API 기본 URL
const API_BASE_URL = "http://54.180.238.119:8080"

export default function RequestsManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [requests, setRequests] = useState<DataRequest[]>([])
  const [currentRequest, setCurrentRequest] = useState<DataRequest | null>(null)
  const [responseText, setResponseText] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<number[]>([]) // 처리 중인 요청 ID 추적

  // 요청 목록 불러오기
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/request/list`, {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched requests:", data)
      setRequests(data.data)
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast({
        title: "데이터 로드 오류",
        description: "요청 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 검색 및 필터링된 요청 목록
  const filteredRequests = requests.filter((item) => {
    const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch

    const statusMap: Record<string, RequestStatus> = {
      대기: "PENDING",
      승인: "APPROVED",
      미승인: "REJECTED",
    }

    return matchesSearch && item.reviewStatus === statusMap[activeTab]
  })

  // 승인 처리
  const handleApprove = async (id: number) => {
    try {
      setProcessingIds((prev) => [...prev, id]) // 처리 중 상태 추가

      console.log(`승인 처리 중: ${id}`)
      console.log(`API 호출: ${API_BASE_URL}/request/list/${id}/review?status=APPROVED`)

      const response = await fetch(`${API_BASE_URL}/request/list/${id}/review?status=APPROVED`, {
        method: "PUT",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("승인 응답:", data)

      // 상태 업데이트
      setRequests(requests.map((item) => (item.dataRequestId === id ? { ...item, reviewStatus: "APPROVED" } : item)))

      toast({
        title: "승인 완료",
        description: "요청이 성공적으로 승인되었습니다.",
      })

      // 목록 새로고침
      fetchRequests()
    } catch (error) {
      console.error("승인 처리 오류:", error)
      toast({
        title: "승인 처리 오류",
        description: "요청을 승인하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id)) // 처리 중 상태 제거
    }
  }

  // 미승인 처리
  const handleReject = async (id: number) => {
    try {
      setProcessingIds((prev) => [...prev, id]) // 처리 중 상태 추가

      console.log(`미승인 처리 중: ${id}`)
      console.log(`API 호출: ${API_BASE_URL}/request/list/${id}/review?status=REJECTED`)

      const response = await fetch(`${API_BASE_URL}/request/list/${id}/review?status=REJECTED`, {
        method: "PUT",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("미승인 응답:", data)

      // 상태 업데이트
      setRequests(requests.map((item) => (item.dataRequestId === id ? { ...item, reviewStatus: "REJECTED" } : item)))

      toast({
        title: "미승인 완료",
        description: "요청이 미승인 처리되었습니다.",
      })

      // 목록 새로고침
      fetchRequests()
    } catch (error) {
      console.error("미승인 처리 오류:", error)
      toast({
        title: "미승인 처리 오류",
        description: "요청을 미승인 처리하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => prev.filter((itemId) => itemId !== id)) // 처리 중 상태 제거
    }
  }

  // 응답 저장
  const handleSaveResponse = async () => {
    if (!currentRequest) return

    try {
      console.log(`응답 저장 중: ${currentRequest.dataRequestId}`)

      const response = await fetch(`${API_BASE_URL}/request/${currentRequest.dataRequestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentRequest,
          response: responseText,
        }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log("응답 저장 결과:", data)

      // 상태 업데이트
      setRequests(
          requests.map((item) =>
              item.dataRequestId === currentRequest.dataRequestId
                  ? {
                    ...item,
                    response: responseText,
                  }
                  : item,
          ),
      )

      setCurrentRequest(null)
      setResponseText("")

      toast({
        title: "응답 저장 완료",
        description: "요청에 대한 응답이 저장되었습니다.",
      })

      // 목록 새로고침
      fetchRequests()
    } catch (error) {
      console.error("응답 저장 오류:", error)
      toast({
        title: "응답 저장 오류",
        description: "응답을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (requestId: number, title?: string) => {
    try {
      const response = await fetch(`http://54.180.238.119:8080/request/download/${requestId}`, {
        method: "GET",
        // 필요시 헤더 추가
      });

      if (!response.ok) {
        throw new Error("파일 다운로드 실패");
      }

      const blob = await response.blob();

      // 응답 헤더에서 파일명 추출 시도 (Content-Disposition)
      const disposition = response.headers.get("Content-Disposition");
      let filename = title || "downloaded_file";

      if (disposition && disposition.indexOf("filename=") !== -1) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      // 확장자가 없으면 .csv 붙이기 (예: myfile → myfile.csv)
      if (!filename.toLowerCase().endsWith(".csv")) {
        filename = filename + ".csv";
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "다운로드 성공",
        description: `${filename} 파일이 다운로드되었습니다.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "다운로드 오류",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };




  // 상태 배지 표시
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              대기
            </Badge>
        )
      case "APPROVED":
        return (
            <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">
              승인
            </Badge>
        )
      case "REJECTED":
        return (
            <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
              미승인
            </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-800" />
          <span className="ml-2">데이터를 불러오는 중...</span>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">데이터 요청 관리</h1>
          <p className="text-muted-foreground">사용자들의 데이터 요청을 관리합니다.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
              placeholder="요청 검색..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-green-50 text-green-900">
            <TabsTrigger value="all" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              전체
            </TabsTrigger>
            <TabsTrigger value="대기" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              대기
            </TabsTrigger>
            <TabsTrigger value="승인" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              승인
            </TabsTrigger>
            <TabsTrigger value="미승인" className="data-[state=active]:bg-green-800 data-[state=active]:text-white">
              미승인
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-green-50">
                  <TableRow>
                    <TableHead>NO.</TableHead>
                    <TableHead>요청자</TableHead>
                    <TableHead>목적</TableHead>
                    <TableHead>요청 데이터</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                  ) : (
                      filteredRequests.map((item, index) => (
                          <TableRow key={item.dataRequestId} className="hover:bg-green-50">
                            <TableCell>{filteredRequests.length - index}</TableCell>
                            <TableCell>{item.user?.username || item.user?.email || "알 수 없음"}</TableCell>
                            <TableCell>{item.purpose}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{formatDate(item.uploadDate)}</TableCell>
                            <TableCell>{getStatusBadge(item.reviewStatus)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-blue-700 border-blue-200"
                                    disabled={!item.fileUrl}
                                    onClick={() => {
                                      if (item.fileUrl) {
                                        // 다운로드 처리 함수 호출
                                        handleDownload(item.dataRequestId, item.title)
                                      }
                                    }}
                                    title={item.fileUrl ? "파일 다운로드" : "다운로드할 파일 없음"}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-green-700 border-green-200"
                                        onClick={() => {
                                          setCurrentRequest(item)
                                          setResponseText(item.response || "")
                                        }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[525px]">
                                    <DialogHeader>
                                      <DialogTitle>데이터 요청 상세</DialogTitle>
                                      <DialogDescription>요청 내용을 확인하고 응답할 수 있습니다.</DialogDescription>
                                    </DialogHeader>
                                    {currentRequest && (
                                        <div className="space-y-4 py-4">
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium">제목</Label>
                                            <div className="rounded-md bg-green-50 p-3">{currentRequest.title}</div>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium">작성자</Label>
                                            <div className="rounded-md bg-green-50 p-3">
                                              {currentRequest.user?.username || currentRequest.user?.email || "알 수 없음"}
                                            </div>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium">소속</Label>
                                            <div className="rounded-md bg-green-50 p-3">{currentRequest.organization}</div>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium">목적</Label>
                                            <div className="rounded-md bg-green-50 p-3">{currentRequest.purpose}</div>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium">요청 내용</Label>
                                            <div className="rounded-md bg-green-50 p-3 min-h-[100px] whitespace-pre-wrap">
                                              {currentRequest.content}
                                            </div>
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-sm font-medium">상태</Label>
                                            <Select
                                                value={currentRequest.reviewStatus}
                                                onValueChange={(value: RequestStatus) => {
                                                  setCurrentRequest({ ...currentRequest, reviewStatus: value as RequestStatus })
                                                }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="상태 선택" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="PENDING">대기</SelectItem>
                                                <SelectItem value="APPROVED">승인</SelectItem>
                                                <SelectItem value="REJECTED">미승인</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-1">
                                            <Label htmlFor="response">응답</Label>
                                            <Textarea
                                                id="response"
                                                placeholder="요청에 대한 응답을 작성하세요..."
                                                className="min-h-[100px]"
                                                value={responseText}
                                                onChange={(e) => setResponseText(e.target.value)}
                                            />
                                          </div>
                                        </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={handleSaveResponse} className="bg-green-800 hover:bg-green-900">
                                        저장
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                {item.reviewStatus === "PENDING" && (
                                    <>
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 text-green-700 border-green-200"
                                          onClick={() => handleApprove(item.dataRequestId)}
                                          disabled={processingIds.includes(item.dataRequestId)}
                                      >
                                        {processingIds.includes(item.dataRequestId) ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 text-red-600 border-red-200"
                                          onClick={() => handleReject(item.dataRequestId)}
                                          disabled={processingIds.includes(item.dataRequestId)}
                                      >
                                        {processingIds.includes(item.dataRequestId) ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
