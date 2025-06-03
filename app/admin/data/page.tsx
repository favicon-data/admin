"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  UploadIcon as FileUpload,
  Plus,
  Search,
  Trash2,
  Download,
} from "lucide-react"
import { datasetApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface Dataset {
  datasetId: number
  organization: string
  title: string
  description: string | null
  createdDate: string | null
  updateDate: string
  view: number
  download: number
  license: string | null
  keyword: string | null
  analysis: string | null
  name: string
  s3Key: string
  datasetTheme: {
    datasetThemeId: number
    theme: string
    region: string | null
    dataYear: string | null
    fileType: string | null
    id: number
  }
  resource: {
    resourceId: number
    resourceName: string
    type: string
    resourceUrl: string
  }
  downloadSet: any[]
}

export default function DataManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const fetchDatasets = async () => {
    try {
      setIsLoading(true)
      const data = await datasetApi.getAllDatasets()
      setDatasets(data.data)
    } catch (error) {
      console.error("Error fetching datasets:", error)
      toast({
        title: "데이터 로드 오류",
        description: "데이터셋 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDatasets()
  }, [toast])

  const filteredDatasets = datasets.filter(
      (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.datasetTheme.theme
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage)
  const paginatedDatasets = filteredDatasets.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "파일 선택 오류",
        description: "업로드할 파일을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("http://54.180.238.119:8080/s3/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) throw new Error(`업로드 실패: ${response.status}`)

      const result = await response.text()
      toast({ title: "업로드 성공", description: result })

      fetchDatasets()
      setFiles([])
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "업로드 오류",
        description: "파일 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const getThemeBadgeClass = (theme: string) => {
    switch (theme) {
      case "질병":
        return "bg-red-100 text-red-800 border-red-200"
      case "환경":
        return "bg-green-100 text-green-800 border-green-200"
      case "기후":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDownloadDataset = async (datasetId: number, title: string) => {
    try {
      setIsProcessing(true)
      const response = await fetch(
          `http://54.180.238.119:8080/data-set/download/${datasetId}`,
          { method: "GET", credentials: "include" }
      )

      if (!response.ok) throw new Error(`다운로드 실패: ${response.status}`)

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "다운로드 성공",
        description: "데이터가 성공적으로 다운로드되었습니다.",
      })

      fetchDatasets()
    } catch (error) {
      console.error("다운로드 오류:", error)
      toast({
        title: "다운로드 오류",
        description: "데이터를 다운로드하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteDataset = async (resourceId: number, title: string) => {
    try {
      setIsProcessing(true)
      const response = await fetch(
          `http://54.180.238.119:8080/s3/delete/${resourceId}`,
          { method: "DELETE", credentials: "include" }
      )

      if (!response.ok) throw new Error(`삭제 실패: ${response.status}`)

      toast({
        title: "삭제 성공",
        description: `"${title}" 데이터가 성공적으로 삭제되었습니다.`,
      })

      fetchDatasets()
    } catch (error) {
      console.error("삭제 오류:", error)
      toast({
        title: "삭제 오류",
        description: "데이터를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">데이터 관리</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-800 hover:bg-green-900">
                <Plus className="mr-2 h-4 w-4" />
                데이터 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>새 데이터 추가</DialogTitle>
                <DialogDescription>
                  FAVICON 데이터 포털에 새로운 데이터 파일을 업로드합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">파일 선택</Label>
                  <div className="flex items-center gap-2">
                    <Input
                        id="file"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    예시: 기후_평균최고기온_기상청_전국.csv
                  </p>
                </div>
                {files.length > 0 && (
                    <div className="rounded-md bg-green-50 p-3">
                      {files.map((file, idx) => (
                          <div key={idx}>
                            <p className="text-sm font-medium">
                              선택된 파일: {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              크기: {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                      ))}
                    </div>
                )}
              </div>
              <DialogFooter>
                <Button
                    onClick={handleUpload}
                    className="bg-green-800 hover:bg-green-900"
                    disabled={isUploading}
                >
                  {isUploading ? (
                      <>
                        <FileUpload className="mr-2 h-4 w-4 animate-pulse" />
                        업로드 중...
                      </>
                  ) : (
                      <>
                        <FileUpload className="mr-2 h-4 w-4" />
                        업로드
                      </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
              placeholder="데이터 검색..."
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
                <TableHead>테마</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>기관</TableHead>
                <TableHead>업데이트일</TableHead>
                <TableHead>조회수</TableHead>
                <TableHead>다운로드</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      데이터를 불러오는 중...
                    </TableCell>
                  </TableRow>
              ) : paginatedDatasets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
              ) : (
                  paginatedDatasets.map((item) => (
                      <TableRow key={item.datasetId} className="hover:bg-green-50">
                        <TableCell>{item.datasetId}</TableCell>
                        <TableCell>
                          <Badge
                              variant="outline"
                              className={`${getThemeBadgeClass(
                                  item.datasetTheme.theme
                              )} border`}
                          >
                            {item.datasetTheme.theme}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.organization}</TableCell>
                        <TableCell>{item.updateDate}</TableCell>
                        <TableCell>{item.view.toLocaleString()}</TableCell>
                        <TableCell>{item.download.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-blue-600 border-blue-200"
                                onClick={() =>
                                    handleDownloadDataset(item.datasetId, item.title)
                                }
                                disabled={isProcessing}
                            >
                              <Download className="h-4 w-4 mr-1" /> 다운로드
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-red-600 border-red-200"
                                    disabled={isProcessing}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> 삭제
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>데이터 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말로 "{item.title}" 데이터를 삭제하시겠습니까?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() =>
                                          handleDeleteDataset(
                                              item.resource.resourceId,
                                              item.title
                                          )
                                      }
                                  >
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

        {/* 페이징 */}
        <div className="flex justify-center mt-4">
          {filteredDatasets.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                >
                  ⏮
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                        (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 2
                    )
                    .map((page, i, arr) => (
                        <React.Fragment key={page}>
                          {i > 0 && page - arr[i - 1] > 1 && (
                              <span className="px-1">...</span>
                          )}
                          <Button
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                    ))}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                  다음
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                  ⏭
                </Button>
              </div>
          )}
        </div>
      </div>
  )
}
