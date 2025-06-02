"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface RequestStats {
  currentMonthTotal: number
  growthFromLastMonth: number
  currentMonthPending: number
  pendingGrowthFromLastMonth: number
  last6MonthsTotals: Record<string, number> // e.g., { "2025-01": 10, "2025-02": 12, ... }
}

interface DatasetStats {
  [key: string]: {
    증가율: number
    개수: number
  }
}

interface UserOverviewStats {
  month: number  // 숫자형 month (e.g., 1, 2, 3)
  count: number
}

interface OverviewProps {
  requestStats: RequestStats | null
  datasetStats: DatasetStats | null
  totalUsers: number | null
  userOverviewStats: UserOverviewStats[] | null
}

export function Overview({
                           requestStats,
                           datasetStats,
                           totalUsers,
                           userOverviewStats,
                         }: OverviewProps) {
  // 월 숫자를 'X월'로 변환
  const formatMonthName = (dateKey: string) => {
    const parts = dateKey.split("-")
    return `${parseInt(parts[1])}월`
  }

  // 월 숫자를 "2025-05" 같은 문자열로 변환
  const formatUserMonthKey = (month: number) => {
    const paddedMonth = month.toString().padStart(2, "0")
    const year = new Date().getFullYear()
    return `${year}-${paddedMonth}`
  }

  const formatChartData = () => {
    if (!requestStats || !datasetStats) {
      return []
    }

    const datasetMonths = Object.keys(datasetStats).sort()
    const requestMonths = Object.keys(requestStats.last6MonthsTotals).sort()

    const userStatsByKey: Record<string, number> = {}
    if (userOverviewStats) {
      userOverviewStats.forEach((item) => {
        const key = formatUserMonthKey(item.month)
        userStatsByKey[key] = item.count
      })
    }

    return datasetMonths.map((datasetKey, index) => {
      const requestKey = requestMonths[index]
      const userCount = userStatsByKey[datasetKey] ?? 0

      return {
        name: formatMonthName(datasetKey),
        데이터: datasetStats[datasetKey]?.개수 || 0,
        요청: requestStats.last6MonthsTotals[requestKey] || 0,
        사용자: userCount,
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
          <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
          />
          <Tooltip formatter={(value, name) => [`${value}`, name]} labelFormatter={(label) => `${label}`} />
          <Legend />
          <Bar dataKey="데이터" fill="#658147" radius={[4, 4, 0, 0]} />
          <Bar dataKey="사용자" fill="#9BBCA5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="요청" fill="#EAEDDB" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
  )
}
