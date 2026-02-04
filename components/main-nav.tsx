"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  Users,
  Stethoscope,
  Home,
  BarChart3,
  Menu,
  UserCog,
  LogOut,
  LogIn,
  UserPlus,
  Loader2,
  Grid3X3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

// Create a separate component for the nav content
function NavContent() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut, isLoading } = useAuth()

  // Check if user is admin by checking email
  const isAdmin = user?.email === "stwright19@gmail.com" || user?.email === "admin@example.com"

  // Handle logout
  const handleLogout = async () => {
    await signOut()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  // Define nav items based on auth status and role
  const getNavItems = () => {
    const items = [
      {
        href: "/",
        label: "Home",
        icon: Home,
        active: pathname === "/",
        color: "blue",
        show: true,
      },
      {
        href: "/staff-directory",
        label: "Staff Directory",
        icon: Users,
        active: pathname === "/staff-directory",
        color: "green",
        show: true,
      },
      {
        href: "/staff",
        label: "Staff Schedule",
        icon: Users,
        active: pathname === "/staff",
        color: "purple",
        show: !!user,
      },
      {
        href: "/provider-schedule",
        label: "Provider Schedule",
        icon: Stethoscope,
        active: pathname === "/provider-schedule",
        color: "green",
        show: !!user,
      },
      {
        href: "/block-schedule",
        label: "Block Schedule",
        icon: Grid3X3,
        active: pathname === "/block-schedule" || pathname.startsWith("/block-schedule/"),
        color: "purple",
        show: !!user,
      },
      {
        href: "/my-shifts",
        label: "My Shifts",
        icon: CalendarDays,
        active: pathname === "/my-shifts",
        color: "amber",
        show: !!user,
      },
      {
        href: "/admin",
        label: "Admin",
        icon: BarChart3,
        active: pathname === "/admin",
        color: "red",
        show: isAdmin,
      },
      {
        href: "/admin/employees",
        label: "Employees",
        icon: UserCog,
        active: pathname.startsWith("/admin/employees"),
        color: "purple",
        show: isAdmin,
      },
    ]

    return items.filter((item) => item.show)
  }

  const navItems = getNavItems()

  // Auth nav items
  const authItems = user
    ? [
        {
          label: "Logout",
          icon: LogOut,
          onClick: handleLogout,
          color: "red",
        },
      ]
    : [
        {
          href: "/auth/login",
          label: "Login",
          icon: LogIn,
          color: "blue",
        },
        {
          href: "/auth/register",
          label: "Register",
          icon: UserPlus,
          color: "green",
        },
      ]

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: isActive ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-100 dark:hover:bg-blue-900/20",
      purple: isActive ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-100 dark:hover:bg-purple-900/20",
      green: isActive ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-100 dark:hover:bg-green-900/20",
      amber: isActive ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100 dark:hover:bg-amber-900/20",
      red: isActive ? "bg-red-600 hover:bg-red-700" : "hover:bg-red-100 dark:hover:bg-red-900/20",
    }
    return colorMap[color as keyof typeof colorMap] || ""
  }

  if (isLoading) {
    return (
      <header className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container flex h-16 items-center px-4">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/images/bbji-logo.png" alt="BBJI Logo" width={100} height={32} className="mr-2" priority />
            </Link>
          </div>
          <div className="ml-auto">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/bbji-logo.png" alt="BBJI Logo" width={100} height={32} className="mr-2" priority />
          </Link>
        </div>

        {isMobile ? (
          <>
            <div className="ml-auto flex items-center gap-2">
              {user && (
                <div className="text-sm font-medium px-3 py-1 bg-blue-100 rounded-full dark:bg-blue-900/30">
                  {user.email?.split("@")[0]}
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b shadow-lg">
                <div className="container py-3">
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full"
                      >
                        <Button
                          variant={item.active ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start text-base h-10",
                            getColorClasses(item.color, item.active),
                          )}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}

                    {/* Auth items */}
                    <div className="border-t my-2 pt-2">
                      {authItems.map((item, idx) => {
                        const Icon = item.icon
                        return item.href ? (
                          <Link key={idx} href={item.href} onClick={() => setMobileMenuOpen(false)} className="w-full">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn("w-full justify-start text-base h-10", getColorClasses(item.color, false))}
                            >
                              <Icon className="h-5 w-5 mr-3" />
                              {item.label}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            key={idx}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              item.onClick?.()
                              setMobileMenuOpen(false)
                            }}
                            className={cn("w-full justify-start text-base h-10", getColorClasses(item.color, false))}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            {item.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} passHref>
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      size="sm"
                      className={cn("h-8 gap-1", getColorClasses(item.color, item.active))}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {user && (
                <div className="text-sm font-medium px-3 py-1 bg-blue-100 rounded-full dark:bg-blue-900/30 mr-2">
                  {user.email?.split("@")[0]}
                </div>
              )}

              {/* Auth buttons */}
              {authItems.map((item, idx) => {
                const Icon = item.icon
                return item.href ? (
                  <Link key={idx} href={item.href} passHref>
                    <Button variant="ghost" size="sm" className={cn("h-8 gap-1", getColorClasses(item.color, false))}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    onClick={item.onClick}
                    className={cn("h-8 gap-1", getColorClasses(item.color, false))}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export function MainNav() {
  return (
    <Suspense
      fallback={
        <header className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <div className="container flex h-16 items-center px-4">
            <div className="mr-4 flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/images/bbji-logo.png" alt="BBJI Logo" width={100} height={32} className="mr-2" priority />
              </Link>
            </div>
            <div className="flex-1"></div>
          </div>
        </header>
      }
    >
      <NavContent />
    </Suspense>
  )
}
