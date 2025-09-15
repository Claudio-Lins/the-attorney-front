'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ChevronRight,
  History,
  Home,
  LogOut,
  Settings,
  Shield,
  User
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Visão geral da conta"
  },
  {
    title: "Meu Perfil",
    href: "/dashboard/profile",
    icon: User,
    description: "Editar informações pessoais"
  },
  {
    title: "Segurança",
    href: "/dashboard/security",
    icon: Shield,
    description: "Senha e autenticação"
  },
  {
    title: "Histórico",
    href: "/dashboard/history",
    icon: History,
    description: "Logins e atividades"
  },
  {
    title: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Preferências gerais"
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6">
        <div className="mb-6">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Site</span>
          </Link>
          <h2 className="text-lg font-semibold text-gray-900">
            Minha Conta
          </h2>
        </div>
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{item.title}</div>
                    {isActive && (
                      <div className="text-xs text-blue-600 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
        
        <Separator className="my-6" />
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/en/sign-in" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </div>
    </div>
  )
} 