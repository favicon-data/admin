"use client"

import type React from "react"

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
import { UploadIcon as FileUpload, Plus, Search, Trash2 } from "lucide-react"
import { datasetApi, s3Api } from "@/lib/api"
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
  datasetTheme: {
    datasetThemeId: number
    theme: string
    region: string | null
    dataYear: string | null
    fileType: string | null
    id: number
  }
  downloadSet: any[]
}

export default function DataManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // 데이터셋 목록 불러오기
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoading(true)
        const data = await datasetApi.getAllDatasets()
        setDatasets(data)
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

    fetchDatasets()
  }, [toast])

  // 검색 필터링
  const filteredDatasets = datasets.filter(
      (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.datasetTheme.theme.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 파일 업로드 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "파일 선택 오류",
        description: "업로드할 파일을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const response = await s3Api.uploadFile(file)

      toast({
        title: "업로드 성공",
        description: "파일이 성공적으로 업로드되었습니다.",
      })

      // 데이터셋 목록 새로고침
      const updatedDatasets = await datasetApi.getAllDatasets()
      setDatasets(updatedDatasets)

      // 파일 선택 초기화
      setFile(null)
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
                <DialogDescription>FAVICON 데이터 포털에 새로운 데이터 파일을 업로드합니다.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">파일 선택</Label>
                  <div className="flex items-center gap-2">
                    <Input id="file" type="file" onChange={handleFileChange} className="flex-1" />
                  </div>
                  <p className="text-xs text-muted-foreground">파일명 형식: [테마ID]_[데이터명]_[기관명]_[지역].[확장자]</p>
                  <p className="text-xs text-muted-foreground">예시: 기후_평균최고기온_기상청_전국.csv </p>
                </div>
                {file && (
                    <div className="rounded-md bg-green-50 p-3">
                      <p className="text-sm font-medium">선택된 파일: {file.name}</p>
                      <p className="text-xs text-muted-foreground">크기: {(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                )}
              </div>
              <DialogFooter>
                <Button
                    type="submit"
                    onClick={handleUpload}
                    className="bg-green-800 hover:bg-green-900"
                    disabled={isUploading || !file}
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
              placeholder="검색어를 입력하세요"
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
              ) : filteredDatasets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
              ) : (
                  filteredDatasets.map((item) => (
                      <TableRow key={item.datasetId} className="hover:bg-green-50">
                        <TableCell>{item.datasetId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-800">
                            {item.datasetTheme.theme}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.organization}</TableCell>
                        <TableCell>{item.updateDate}</TableCell>
                        <TableCell>{(item.view ?? 0).toLocaleString()}</TableCell>
                        <TableCell>{(item.download ?? 0).toLocaleString()}</TableCell>
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
                                  <AlertDialogTitle>데이터 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말로 이 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">삭제</AlertDialogAction>
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
