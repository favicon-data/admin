import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Request {
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
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED"
  reviewedBy: number | null
  reviewDate: string | null
  organization: string
  userId: number
}

interface RecentRequestsProps {
  requests?: Request[]
  isLoading?: boolean
}

export function RecentRequests({ requests = [], isLoading = false }: RecentRequestsProps) {
  const getStatusBadge = (status: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    })
  }

  if (isLoading) {
    return (
        <div className="flex h-32 items-center justify-center">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">로딩 중...</span>
          </div>
        </div>
    )
  }

  if (requests.length === 0) {
    return (
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">최근 요청이 없습니다.</div>
          </div>
        </div>
    )
  }

  return (
      <div className="space-y-8">
        {requests.map((request) => (
            <div key={request.dataRequestId} className="flex items-center">
              <Avatar className="h-9 w-9" style={{ backgroundColor: "#EAEDDB" }}>
                <AvatarFallback style={{ backgroundColor: "#EAEDDB", color: "#1f2d20" }}>
                  {request.user.username ? request.user.username.charAt(0) : request.user.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{request.user.username || request.user.email}</p>
                <p className="text-sm text-muted-foreground truncate">{request.title}</p>
                <p className="text-xs text-muted-foreground">{request.organization}</p>
              </div>
              <div className="ml-auto flex flex-col items-end space-y-1">
                {getStatusBadge(request.reviewStatus)}
                <span className="text-xs text-muted-foreground">{formatDate(request.uploadDate)}</span>
              </div>
            </div>
        ))}
      </div>
  )
}
