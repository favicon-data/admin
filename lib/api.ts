// API 기본 URL
// const API_BASE_URL = "http://54.180.238.119:8080"
const API_BASE_URL = "http://localhost:8082"

// 사용자 관련 API
export const userApi = {
  // 이메일 인증 코드 발송
  sendEmailCode: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/users/email-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    })
    return response.json()
  },

  // 인증 코드 확인
  verifyCode: async (email: string, code: string) => {
    const response = await fetch(`${API_BASE_URL}/users/code-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
      credentials: "include",
    })
    return response.json()
  },

  // 회원가입
  register: async (registerData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
      credentials: "include",
    })
    return response.json()
  },

  // 로그인
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
    return response.json()
  },

  // 로그아웃
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    })
    return response.json()
  },

  // 계정 삭제
  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
      method: "DELETE",
      credentials: "include",
    })
    return response.json()
  },

  // 세션 확인
  checkSession: async () => {
    const response = await fetch(`${API_BASE_URL}/users/session-check`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 관리자 권한 확인
  checkAdmin: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/admin-check`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      console.log("Admin check API response:", data)
      return data
    } catch (error) {
      console.error("Admin check API error:", error)
      throw error
    }
  },
}

// 데이터셋 관련 API
export const datasetApi = {
  // 모든 데이터셋 가져오기
  getAllDatasets: async () => {
    const response = await fetch(`${API_BASE_URL}/data-set`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 상위 9개 데이터셋 가져오기
  getTop9Datasets: async () => {
    const response = await fetch(`${API_BASE_URL}/data-set/top9`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 데이터셋 통계 가져오기
  getDataStats: async () => {
    const response = await fetch(`${API_BASE_URL}/data-set/stats`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 다운로드 수 증가
  incrementDownload: async (datasetId: number) => {
    const response = await fetch(`${API_BASE_URL}/data-set/incrementDownload/${datasetId}`, {
      method: "POST",
      credentials: "include",
    })
    return response.json()
  },

  // 테마별 필터링
  filterByTheme: async (theme: string) => {
    const response = await fetch(`${API_BASE_URL}/data-set/theme?theme=${theme}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 총 데이터셋 수 가져오기
  getTotalDatasetCount: async () => {
    const response = await fetch(`${API_BASE_URL}/data-set/count`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 데이터셋 상세 정보 가져오기
  getDatasetDetails: async (datasetId: number) => {
    const response = await fetch(`${API_BASE_URL}/data-set/${datasetId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 테마별 통계 가져오기
  getThemeStats: async () => {
    const response = await fetch(`${API_BASE_URL}/data-set/ratio`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 카테고리별 데이터셋 가져오기
  getDatasetsByCategory: async (themeId: number) => {
    const response = await fetch(`${API_BASE_URL}/data-set/category/${themeId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 데이터셋 검색
  searchDatasets: async (searchText: string) => {
    const response = await fetch(`${API_BASE_URL}/data-set/search-sorted`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: searchText }),
      credentials: "include",
    })
    return response.json()
  },

  // 테마별 그룹화된 데이터셋 가져오기
  getDatasetsGroupedByTheme: async () => {
    const response = await fetch(`${API_BASE_URL}/data-set/group-by-theme`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },
}

// S3 파일 업로드/삭제 관련 API
export const s3Api = {
  // 파일 업로드
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/s3/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
    return response.json()
  },

  // 파일 삭제
  deleteFile: async (resourceId: number) => {
    const response = await fetch(`${API_BASE_URL}/s3/delete/${resourceId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return response.json()
  },
}

// FAQ 관련 API
export const faqApi = {
  // FAQ 생성
  createFAQ: async (faqData: { question: string; answer: string; category: string }) => {
    console.log("Creating FAQ with data:", faqData)
    const response = await fetch(`${API_BASE_URL}/faq/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faqData),
      credentials: "include",
    })
    return response.json()
  },

  // FAQ 수정
  updateFAQ: async (faqId: number, faqData: { question: string; answer: string; category: string }) => {
    console.log(`Updating FAQ ${faqId} with data:`, faqData)
    const response = await fetch(`${API_BASE_URL}/faq/${faqId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faqData),
      credentials: "include",
    })
    return response.json()
  },

  // FAQ 삭제
  deleteFAQ: async (faqId: number) => {
    const response = await fetch(`${API_BASE_URL}/faq/${faqId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return response.json()
  },

  // 모든 FAQ 가져오기
  getAllFAQs: async () => {
    const response = await fetch(`${API_BASE_URL}/faq/list`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // FAQ 상세 정보 가져오기
  getFAQById: async (faqId: number) => {
    const response = await fetch(`${API_BASE_URL}/faq/${faqId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },
}

// 공지사항 관련 API
export const noticeApi = {
  // 공지사항 생성
  createNotice: async (noticeData: { title: string; content: string; important: boolean }) => {
    const response = await fetch(`${API_BASE_URL}/notice/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticeData),
      credentials: "include",
    })
    return response.json()
  },

  // 공지사항 수정
  updateNotice: async (noticeId: number, noticeData: { title: string; content: string; important: boolean }) => {
    const response = await fetch(`${API_BASE_URL}/notice/${noticeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noticeData),
      credentials: "include",
    })
    return response.json()
  },

  // 공지사항 삭제
  deleteNotice: async (noticeId: number) => {
    const response = await fetch(`${API_BASE_URL}/notice/${noticeId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return response.json()
  },

  // 모든 공지사항 가져오기
  getAllNotices: async () => {
    const response = await fetch(`${API_BASE_URL}/notice/list`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 공지사항 상세 정보 가져오기
  getNoticeById: async (noticeId: number) => {
    const response = await fetch(`${API_BASE_URL}/notice/${noticeId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 공지사항 조회
  getNotice: async (noticeId: number) => {
    const response = await fetch(`${API_BASE_URL}/notice/view/${noticeId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },
}

// 데이터 요청 관련 API
export const requestApi = {
  // 모든 요청 목록 가져오기
  getAllRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/request/list`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 새 요청 생성
  createRequest: async (requestData: any) => {
    const response = await fetch(`${API_BASE_URL}/request/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      credentials: "include",
    })
    return response.json()
  },

  // 요청 상태 업데이트 (승인/미승인)
  updateRequestStatus: async (requestId: number, status: string) => {
    console.log(`API call: Updating request ${requestId} status to ${status}`)
    const response = await fetch(`${API_BASE_URL}/request/list/${requestId}/review?status=${status}`, {
      method: "PUT",
      credentials: "include",
    })
    return response.json()
  },

  // 요청 수정
  updateRequest: async (requestId: number, requestData: any) => {
    console.log(`API call: Updating request ${requestId}`, requestData)
    const response = await fetch(`${API_BASE_URL}/request/${requestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
      credentials: "include",
    })
    return response.json()
  },

  // 요청 삭제
  deleteRequest: async (requestId: number) => {
    const response = await fetch(`${API_BASE_URL}/request/${requestId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return response
  },

  // 사용자별 질문 목록 가져오기
  getQuestionsByUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/request/question?userId=${userId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 질문별 답변 목록 가져오기
  getAnswersByQuestion: async (questionId: number) => {
    const response = await fetch(`${API_BASE_URL}/request/answer?questionId=${questionId}`, {
      method: "GET",
      credentials: "include",
    })
    return response.json()
  },

  // 질문 생성
  createQuestion: async (questionData: any) => {
    const response = await fetch(`${API_BASE_URL}/request/question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
      credentials: "include",
    })
    return response.json()
  },

  // 질문 수정
  updateQuestion: async (questionId: number, questionData: any) => {
    const response = await fetch(`${API_BASE_URL}/request/question/${questionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
      credentials: "include",
    })
    return response.json()
  },

  // 질문 삭제
  deleteQuestion: async (questionId: number) => {
    const response = await fetch(`${API_BASE_URL}/request/question/${questionId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return response
  },

  // 답변 생성
  createAnswer: async (answerData: any) => {
    const response = await fetch(`${API_BASE_URL}/request/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answerData),
      credentials: "include",
    })
    return response.json()
  },

  // 답변 수정
  updateAnswer: async (answerId: number, answerData: any) => {
    const response = await fetch(`${API_BASE_URL}/request/answer/${answerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answerData),
      credentials: "include",
    })
    return response.json()
  },

  // 답변 삭제
  deleteAnswer: async (answerId: number) => {
    const response = await fetch(`${API_BASE_URL}/request/answer/${answerId}`, {
      method: "DELETE",
      credentials: "include",
    })
    return response
  },
}

export const adminApi = {

    // 계정 삭제
    deleteAccountByAdmin: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/delete-user`, {
        method: "DELETE",
        credentials: "include",
      })
      return response.json()
    },

}


export const statisticsApi = {

    // 전체 사용자 및 증가비율
    getUserStats: async () => {
      const response = await fetch(`${API_BASE_URL}/statistics/user-stats`, {
        method: "GET",
        credentials: "include",
      })
      return response.json()
    },

    // 사용자 개요
    getUserOverview: async () => {
      const response = await fetch(`${API_BASE_URL}/statistics/user-overview`, {
        method: "GET",
        credentials: "include",
      })
      return response.json()
    },

    // 전체 유저
    getAllUser: async () => {
      const response = await fetch(`${API_BASE_URL}/statistics/all-user`, {
        method: "GET",
        credentials: "include",
      })
      return response.json()
    },

}