import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentRequests() {
  return (
    <div className="space-y-8">
      {recentRequests.map((request) => (
        <div key={request.id} className="flex items-center">
          <Avatar className="h-9 w-9 bg-green-100">
            <AvatarFallback className="bg-green-100 text-green-800">{request.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{request.name}</p>
            <p className="text-sm text-muted-foreground">{request.title}</p>
          </div>
          <div className="ml-auto">
            <Badge
              variant={request.status === "대기" ? "outline" : request.status === "승인" ? "success" : "destructive"}
            >
              {request.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

const recentRequests = [
  {
    id: "1",
    name: "김철수",
    title: "2023년 지역별 인구 통계 데이터 요청",
    status: "대기",
  },
  {
    id: "2",
    name: "이영희",
    title: "코로나19 백신 접종률 데이터 요청",
    status: "승인",
  },
  {
    id: "3",
    name: "박지민",
    title: "지난 5년간 대기 오염도 데이터 요청",
    status: "대기",
  },
  {
    id: "4",
    name: "최민수",
    title: "서울시 지하철 이용객 통계 데이터 요청",
    status: "미승인",
  },
  {
    id: "5",
    name: "정다운",
    title: "전국 초중고 학생 수 데이터 요청",
    status: "대기",
  },
]
