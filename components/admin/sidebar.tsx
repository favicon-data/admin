"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Database,
  FileText,
  HelpCircle,
  Home,
  Menu,
  MessageSquare,
  Users,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

const SIDEBAR_BG = "#9BBCA5"
const TEXT_COLOR = "#1B4332"
const ACTIVE_BG = "#D8EEDB"
const HOVER_BG = "#B7D0BE"

const routes = [
  { label: "대시보드", icon: Home, href: "/admin" },
  { label: "데이터 관리", icon: Database, href: "/admin/data" },
  { label: "공지사항", icon: FileText, href: "/admin/announcements" },
  { label: "데이터 요청", icon: MessageSquare, href: "/admin/requests" },
  { label: "자주 묻는 질문", icon: HelpCircle, href: "/admin/faq" },
  { label: "사용자 관리", icon: Users, href: "/admin/users" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
      <>
        {/* 모바일 */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
              <Menu className="h-5 w-5" style={{ color: TEXT_COLOR }} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex h-full flex-col" style={{ backgroundColor: SIDEBAR_BG }}>
              <div className="px-3 py-4">
                <div className="mb-2 flex items-center justify-between px-4">
                  <h2 className="text-lg font-semibold tracking-tight" style={{ color: TEXT_COLOR }}>
                    FAVICON
                  </h2>
                  <Button variant="outline" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4" style={{ color: TEXT_COLOR }} />
                  </Button>
                </div>
                <div className="space-y-1">
                  {routes.map((route) => {
                    const isActive = pathname === route.href
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                                isActive
                                    ? "bg-[##D8EEDB]"
                                    : "hover:bg-[#B7D0BE]"
                            )}
                            style={{
                              color: TEXT_COLOR,
                              backgroundColor: isActive ? ACTIVE_BG : "transparent",
                            }}
                        >
                          <route.icon className="mr-2 h-4 w-4" style={{ color: TEXT_COLOR }} />
                          {route.label}
                        </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* 데스크탑 */}
        <div className="hidden md:block md:w-64 border-r" style={{ backgroundColor: SIDEBAR_BG }}>
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
              <Link href="/admin" className="flex items-center gap-2 font-semibold" style={{ color: TEXT_COLOR }}>
                <Database className="h-6 w-6" style={{ color: TEXT_COLOR }} />
                <span className="text-lg">FAVICON</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {routes.map((route) => {
                  const isActive = pathname === route.href
                  return (
                      <Link
                          key={route.href}
                          href={route.href}
                          className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                              isActive ? "font-semibold" : ""
                          )}
                          style={{
                            color: TEXT_COLOR,
                            backgroundColor: isActive ? ACTIVE_BG : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = HOVER_BG
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
                          }}
                      >
                        <route.icon className="h-4 w-4" style={{ color: TEXT_COLOR }} />
                        {route.label}
                      </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </>
  )
}
