"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

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

interface OverviewProps {
  requestStats: RequestStats | null
  datasetStats: DatasetStats | null
  totalUsers: number | null
}

export function Overview({ requestStats, datasetStats, totalUsers }: OverviewProps) {
  // 날짜 키를 월 이름으로 변환하는 함수
  const formatMonthName = (dateKey: string) => {
    // "2025-05" -> "5월"
    const month = dateKey.split("-")[1]
    return `${Number.parseInt(month)}월`
  }

  // API 데이터를 차트 형식으로 변환
  const formatChartData = () => {
    if (!requestStats || !datasetStats) {
      // 로딩 중일 때는 빈 배열 반환
      return []
    }

    // 데이터셋 통계의 키들을 정렬해서 가져오기
    const datasetMonths = Object.keys(datasetStats).sort()
    const requestMonths = Object.keys(requestStats.last6MonthsTotals).sort()

    // 데이터셋 월 기준으로 차트 데이터 생성
    return datasetMonths.map((datasetKey, index) => {
      const requestKey = requestMonths[index] // 같은 인덱스의 요청 데이터 사용

      // 사용자 수는 전체 사용자 수를 기반으로 월별 추정치 계산
      const estimatedUsers = totalUsers ? Math.round(totalUsers * (0.7 + index * 0.05)) : 0

      return {
        name: formatMonthName(datasetKey), // 동적으로 월 이름 생성
        데이터: datasetStats[datasetKey]?.개수 || 0,
        사용자: estimatedUsers,
        요청: requestStats.last6MonthsTotals[requestKey] || 0,
      }
    })
  }

  const data = formatChartData()

  if (data.length === 0) {
    return (
        <div className="flex h-[350px] items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">데이터를 불러오는 중...</div>
          </div>
        </div>
    )
  }

  return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
          <Tooltip formatter={(value, name) => [`${value}`, name]} labelFormatter={(label) => `${label}`} />
          <Legend />
          <Bar dataKey="데이터" fill="#166534" radius={[4, 4, 0, 0]} />
          <Bar dataKey="사용자" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="요청" fill="#86efac" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
  )
}
