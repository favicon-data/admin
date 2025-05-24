"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentRequests } from "@/components/admin/recent-requests"
import { ArrowDown, ArrowUp } from "lucide-react"

export default function AdminDashboard() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
          <p className="text-muted-foreground">FAVICON 데이터 포털 관리자 페이지에 오신 것을 환영합니다.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">전체 데이터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <div className="flex items-center text-xs text-green-700">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>12% 증가</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <div className="flex items-center text-xs text-red-600">
                <ArrowDown className="mr-1 h-4 w-4" />
                <span>5% 감소</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">이번 달 요청</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <div className="flex items-center text-xs text-green-700">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>8% 증가</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,542</div>
              <div className="flex items-center text-xs text-green-700">
                <ArrowUp className="mr-1 h-4 w-4" />
                <span>15% 증가</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>개요</CardTitle>
              <CardDescription>지난 6개월 동안의 증가량 개요입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>최근 데이터 요청</CardTitle>
              <CardDescription>최근에 접수된 데이터 요청입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentRequests />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
