"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "1월",
    데이터: 200,
    사용자: 240,
    요청: 8,
  },
  {
    name: "2월",
    데이터: 300,
    사용자: 320,
    요청: 10,
  },
  {
    name: "3월",
    데이터: 400,
    사용자: 280,
    요청: 12,
  },
  {
    name: "4월",
    데이터: 500,
    사용자: 390,
    요청: 15,
  },
  {
    name: "5월",
    데이터: 600,
    사용자: 480,
    요청: 20,
  },
  {
    name: "6월",
    데이터: 700,
    사용자: 520,
    요청: 18,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip formatter={(value, name) => [`${value} 증가`, name]} labelFormatter={(label) => `${label}의 증가량`} />
        <Legend />
        <Bar dataKey="데이터" fill="#166534" radius={[4, 4, 0, 0]} />
        <Bar dataKey="사용자" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="요청" fill="#4ade80" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
