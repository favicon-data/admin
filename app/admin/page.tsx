"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentRequests } from "@/components/admin/recent-requests"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"
import { userApi, datasetApi } from "@/lib/api"

interface RequestStats {
  currentMonthTotal: number
  growthFromLastMonth: number
  currentMonthPending: number
  pendingGrowthFromLastMonth: number
  last6MonthsTotals: Record<string, number>
}

interface DatasetStats {
  [key: string]: {
    증가율: number
    개수: number
  }
}

interface UserStats {
  total: number
  rate: number
}

interface UserOverviewStats {
  month: number
  count: number
}

export default function AdminDashboard() {
  const [requestStats, setRequestStats] = useState<RequestStats | null>(null)
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null)
  const [totalDatasets, setTotalDatasets] = useState<number | null>(null)
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userRate, setUserRate] = useState<number | null>(null)
  const [userOverviewStats, setUserOverviewStats] = useState<UserOverviewStats[] | null>(null)



  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)

        // 요청 통계 가져오기
        const requestResponse = await fetch("http://54.180.238.119:8080/request/stats", {
          method: "GET",
          credentials: "include",
        })
        if (requestResponse.ok) {
          const requestData = await requestResponse.json()
          setRequestStats(requestData.data)
        }

        // 데이터셋 통계 가져오기
        const datasetResponse = await fetch("http://54.180.238.119:8080/data-set/stats", {
          method: "GET",
          credentials: "include",
        })
        if (datasetResponse.ok) {
          const datasetData = await datasetResponse.json()
          setDatasetStats(datasetData.data)
        }

        // 전체 데이터셋 수 가져오기
        try {
          const countData = await datasetApi.getTotalDatasetCount()
          setTotalDatasets(countData.data)
        } catch (error) {
          console.error("데이터셋 수 조회 오류:", error)
        }

        // 사용자 개요 통계 가져오기
        try {
          const userOverviewRes = await fetch("http://54.180.238.119:8080/statistics/user-overview", {
            method: "GET",
            credentials: "include",
          })
          if (userOverviewRes.ok) {
            const overviewData = await userOverviewRes.json()
            setUserOverviewStats(overviewData.data)
          }
        } catch (error) {
          console.error("사용자 개요 통계 오류:", error)
        }


        // 사용자 통계 가져오기
        try {
          const userStatsResponse = await fetch("http://54.180.238.119:8080/statistics/user-stats", {
            method: "GET",
            credentials: "include",
          })
          if (userStatsResponse.ok) {
            const userStatsData = await userStatsResponse.json()
            setUserStats(userStatsData.data)
            setTotalUsers(userStatsData.data.total)
            setUserRate(userStatsData.data.rate)
          }
        } catch (error) {
          console.error("사용자 통계 조회 오류:", error)
        }


        // 최근 데이터 요청 가져오기
        try {
          const requestsResponse = await fetch("http://54.180.238.119:8080/request/list", {
            method: "GET",
            credentials: "include",
          })
          if (requestsResponse.ok) {
            const requestsData = await requestsResponse.json()
            // 최근 5개만 가져오기
            setRecentRequests(requestsData.data.slice(0, 4))
          }
        } catch (error) {
          console.error("최근 요청 조회 오류:", error)
        }
      } catch (error) {
        console.error("통계 데이터 로드 오류:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // 최근 월의 데이터셋 증가율 계산
  const getLatestDatasetGrowth = () => {
    if (!datasetStats) return 0
    const months = Object.keys(datasetStats).sort()
    const latestMonth = months[months.length - 1]
    return datasetStats[latestMonth]?.증가율 || 0
  }

  // 사용자 증가율 계산 (임시로 데이터셋 증가율의 절반으로 설정)
  const getUserGrowth = () => {
    //const datasetGrowth = getLatestDatasetGrowth()
    return userRate !== null ? Math.round(userRate) : 0
  }

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
              {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">로딩 중...</span>
                  </div>
              ) : (
                  <>
                    <div className="text-2xl font-bold">{totalDatasets?.toLocaleString() || "0"}</div>
                    <div className="flex items-center text-xs text-green-700">
                      {getLatestDatasetGrowth() >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4" />
                      ) : (
                          <ArrowDown className="mr-1 h-4 w-4" />
                      )}
                      <span>{getLatestDatasetGrowth()}% 증가</span>
                    </div>
                  </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">승인 대기</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">로딩 중...</span>
                  </div>
              ) : (
                  <>
                    <div className="text-2xl font-bold">{requestStats?.currentMonthPending || 0}</div>
                    <div className="flex items-center text-xs">
                      {(requestStats?.pendingGrowthFromLastMonth || 0) >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4 text-green-700" />
                      ) : (
                          <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                      )}
                      <span
                          className={`${(requestStats?.pendingGrowthFromLastMonth || 0) >= 0 ? "text-green-700" : "text-red-600"}`}
                      >
                    {requestStats?.pendingGrowthFromLastMonth || 0}%
                        {(requestStats?.pendingGrowthFromLastMonth || 0) >= 0 ? " 증가" : " 감소"}
                  </span>
                    </div>
                  </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">이번 달 요청</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">로딩 중...</span>
                  </div>
              ) : (
                  <>
                    <div className="text-2xl font-bold">{requestStats?.currentMonthTotal || 0}</div>
                    <div className="flex items-center text-xs">
                      {(requestStats?.growthFromLastMonth || 0) >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4 text-green-700" />
                      ) : (
                          <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                      )}
                      <span
                          className={`${(requestStats?.growthFromLastMonth || 0) >= 0 ? "text-green-700" : "text-red-600"}`}
                      >
                    {requestStats?.growthFromLastMonth || 0}%
                        {(requestStats?.growthFromLastMonth || 0) >= 0 ? " 증가" : " 감소"}
                  </span>
                    </div>
                  </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">로딩 중...</span>
                  </div>
              ) : (
                  <>
                    <div className="text-2xl font-bold">{totalUsers?.toLocaleString() || "0"}</div>
                    <div className="flex items-center text-xs">
                      {getUserGrowth() >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4 text-green-700" />
                      ) : (
                          <ArrowDown className="mr-1 h-4 w-4 text-red-600" />
                      )}
                      <span className={`${getUserGrowth() >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {getUserGrowth()}%{getUserGrowth() >= 0 ? " 증가" : " 감소"}
                  </span>
                    </div>
                  </>
              )}
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
              <Overview requestStats={requestStats} datasetStats={datasetStats} totalUsers={totalUsers} userOverviewStats={userOverviewStats}/>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>최근 데이터 요청</CardTitle>
              <CardDescription>최근에 접수된 데이터 요청입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentRequests requests={recentRequests} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
