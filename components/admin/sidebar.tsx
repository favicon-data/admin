"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {Database, FileText, HelpCircle, Home, Menu, MessageSquare, Users, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

const routes = [
  {
    label: "대시보드",
    icon: Home,
    href: "/admin",
    color: "text-green-600",
  },
  {
    label: "데이터 관리",
    icon: Database,
    href: "/admin/data",
    color: "text-green-600",
  },
  {
    label: "공지사항",
    icon: FileText,
    href: "/admin/announcements",
    color: "text-green-600",
  },
  {
    label: "데이터 요청",
    icon: MessageSquare,
    href: "/admin/requests",
    color: "text-green-600",
  },
  {
    label: "자주 묻는 질문",
    icon: HelpCircle,
    href: "/admin/faq",
    color: "text-green-600",
  },
  {
    label: "사용자 관리",
    icon: Users,
    href: "/admin/users",
    color: "text-green-600",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex h-full flex-col bg-green-50">
              <div className="px-3 py-4">
                <div className="mb-2 flex items-center justify-between px-4">
                  <h2 className="text-lg font-semibold tracking-tight text-green-800">FAVICON</h2>
                  <Button variant="outline" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {routes.map((route) => (
                      <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-green-100 hover:text-green-950",
                              pathname === route.href ? "bg-green-100 text-green-950" : "text-green-800",
                          )}
                      >
                        <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                        {route.label}
                      </Link>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="hidden border-r bg-green-50 md:block md:w-64">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
              <Link href="/admin" className="flex items-center gap-2 font-semibold text-green-800">
                <Database className="h-6 w-6 text-green-700" />
                <span className="text-lg">FAVICON</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                            pathname === route.href
                                ? "bg-green-200 text-green-950"
                                : "text-green-800 hover:bg-green-100 hover:text-green-950",
                        )}
                    >
                      <route.icon className={cn("h-4 w-4", route.color)} />
                      {route.label}
                    </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </>
  )
}
