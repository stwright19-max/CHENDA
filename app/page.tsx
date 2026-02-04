"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  CalendarIcon,
  Users,
  DoorOpen,
  Clock,
  ArrowRight,
  AlertCircle,
  MapPin,
  Stethoscope,
  CalendarDays,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Sample staff data
const staffMembers = [
  { id: 1, name: "Jon Shaker", department: "Clinical", title: "Physician Assistant", location: "Waltham" },
  { id: 2, name: "Dr. Sarah Johnson", department: "Clinical", title: "Primary Care Physician", location: "Dedham" },
  { id: 3, name: "Dr. Michael Chen", department: "Clinical", title: "Cardiologist", location: "Woburn" },
  { id: 4, name: "Jason Rand", department: "Administrative", title: "Office Manager", location: "Waltham" },
  { id: 5, name: "Emily Rodriguez", department: "Clinical", title: "Medical Assistant", location: "Westboro" },
  { id: 6, name: "Stephen Wright", department: "Coordinator", title: "Patient Coordinator", location: "Dedham" },
  { id: 7, name: "Dr. Lisa Wong", department: "Clinical", title: "Orthopedic Surgeon", location: "Waltham" },
  { id: 8, name: "Dr. Robert Taylor", department: "Clinical", title: "Rheumatologist", location: "Woburn" },
  { id: 9, name: "Dr. James Wilson", department: "Clinical", title: "Sports Medicine", location: "Westboro" },
  { id: 10, name: "Dr. Maria Garcia", department: "Clinical", title: "Physical Therapist", location: "Dedham" },
  { id: 11, name: "Dr. David Kim", department: "Clinical", title: "Pain Management", location: "Waltham" },
  { id: 12, name: "Dr. Susan Lee", department: "Clinical", title: "Neurologist", location: "Woburn" },
]

// Sample data for rooms
const rooms = {
  Waltham: ["Room 101", "Room 102", "Room 103", "Room 104", "Room 105"],
  Dedham: ["Room 201", "Room 202", "Room 203", "Room 204"],
  Woburn: ["Room 301", "Room 302", "Room 303"],
  Westboro: ["Room 401", "Room 402", "Room 403", "Room 404", "Room 405"],
  Remote: [],
}

// Generate out of office data
const generateOutOfOfficeData = (date: Date) => {
  // Use date to seed the random generator for consistent results
  const seed = date.getDate() + date.getMonth() * 31
  const seedRandom = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280

  // Determine how many staff are out today (1-3)
  const staffOutCount = Math.floor(seedRandom(seed) * 3) + 1

  // Select random staff members to be out
  const staffOut = []
  const availableStaff = [...staffMembers]

  for (let i = 0; i < staffOutCount; i++) {
    const index = Math.floor(seedRandom(seed + i) * availableStaff.length)
    const staff = availableStaff.splice(index, 1)[0]

    // Determine if they're on leave or just off duty
    const isOnLeave = seedRandom(seed + staff.id) > 0.7

    // Find coverage for providers and coordinators
    let coverage = null
    if (staff.department === "Clinical" || staff.department === "Coordinator") {
      const availableCoverage = availableStaff.filter((s) => s.department === staff.department)
      if (availableCoverage.length > 0) {
        const coverageIndex = Math.floor(seedRandom(seed + staff.id * 10) * availableCoverage.length)
        coverage = availableCoverage[coverageIndex]
      }
    }

    staffOut.push({
      ...staff,
      status: isOnLeave ? "On Leave" : "Off Duty",
      coverage,
    })
  }

  return staffOut
}

// Get providers by location
const getProvidersByLocation = () => {
  const providers = staffMembers.filter((staff) => staff.department === "Clinical")
  const providersByLocation = {}

  for (const location of Object.keys(rooms)) {
    providersByLocation[location] = providers.filter((provider) => provider.location === location).length
  }

  return providersByLocation
}

// Get rooms by location
const getRoomsByLocation = () => {
  const roomsByLocation = {}

  for (const [location, locationRooms] of Object.entries(rooms)) {
    roomsByLocation[location] = locationRooms.length
  }

  return roomsByLocation
}

export default function HomePage() {
  const [date, setDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [statsView, setStatsView] = useState<"summary" | "byLocation">("summary")

  // Get staff who are out today
  const staffOut = generateOutOfOfficeData(date)

  // Get providers and rooms by location
  const providersByLocation = getProvidersByLocation()
  const roomsByLocation = getRoomsByLocation()

  // Calculate totals
  const totalProviders = Object.values(providersByLocation).reduce((sum: number, count: number) => sum + count, 0)
  const totalRooms = Object.values(roomsByLocation).reduce((sum: number, count: number) => sum + count, 0)

  // Sample quick stats
  const quickStats = [
    { title: "Total Providers", value: totalProviders.toString(), icon: Users },
    { title: "Clinic Rooms", value: totalRooms.toString(), icon: DoorOpen },
    { title: "Clinic Hours", value: "9-5", icon: Clock },
  ]

  // Sample recent notifications
  const recentNotifications = [
    {
      title: "Room 103 Maintenance",
      description: "Room 103 will be unavailable on Friday for maintenance",
      time: "2 hours ago",
    },
    {
      title: "New Schedule Posted",
      description: "The schedule for next month has been posted",
      time: "Yesterday",
    },
    {
      title: "Time Off Request Approved",
      description: "Your time off request for next week has been approved",
      time: "2 days ago",
    },
  ]

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
      {/* Header with date selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">BBJI Dashboard</h1>
          <div className="text-muted-foreground">Welcome back to the staff scheduling system</div>
        </div>

        <div className="mt-4 sm:mt-0">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-auto justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date || new Date())
                  setCalendarOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Quick stats with tabs for summary and by location views */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Resource Overview</CardTitle>
          <Tabs defaultValue="summary" onValueChange={(value) => setStatsView(value as any)}>
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="byLocation">By Location</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {statsView === "summary" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                )
              })}
            </div>
          )}

          {statsView === "byLocation" && (
            <div className="space-y-6">
              {/* Providers by location */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Providers by Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(providersByLocation).map(([location, count]) => (
                    <div key={location} className="border rounded-md p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{location}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms by location */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <DoorOpen className="mr-2 h-5 w-5" />
                  Clinic Rooms by Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(roomsByLocation).map(([location, count]) => (
                    <div key={location} className="border rounded-md p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{location}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Out Today */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Staff Out Today
          </CardTitle>
          <CardDescription>
            {staffOut.length > 0
              ? `${staffOut.length} staff member${staffOut.length > 1 ? "s" : ""} out on ${format(date, "EEEE, MMMM d")}`
              : `No staff members out on ${format(date, "EEEE, MMMM d")}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffOut.length > 0 ? (
            <div className="space-y-4">
              {staffOut.map((staff) => (
                <div
                  key={staff.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{staff.name}</span>
                      <Badge
                        variant={staff.status === "On Leave" ? "outline" : "secondary"}
                        className={staff.status === "On Leave" ? "text-amber-500 border-amber-500" : ""}
                      >
                        {staff.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{staff.title}</div>
                  </div>
                  {staff.coverage && (
                    <div className="mt-2 sm:mt-0">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Coverage:</span> {staff.coverage.name}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">All staff members are scheduled to work today.</div>
          )}
        </CardContent>
      </Card>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="md:col-span-1 border-purple-200 dark:border-purple-900">
          <CardHeader className="bg-purple-50 dark:bg-purple-950/30">
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
              <Users className="mr-2 h-5 w-5" />
              Staff Schedule
            </CardTitle>
            <CardDescription>View and manage staff schedules</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Access the complete staff schedule, filter by location or department, and manage assignments.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/staff" className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                View Schedule
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1 border-green-200 dark:border-green-900">
          <CardHeader className="bg-green-50 dark:bg-green-950/30">
            <CardTitle className="flex items-center text-green-700 dark:text-green-400">
              <Stethoscope className="mr-2 h-5 w-5" />
              Provider Schedule
            </CardTitle>
            <CardDescription>Manage clinic schedules and rooms</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              View provider schedules, room assignments, and request or release clinic slots.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/provider-schedule" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Provider Schedule
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1 border-amber-200 dark:border-amber-900">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30">
            <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
              <CalendarDays className="mr-2 h-5 w-5" />
              My Shifts
            </CardTitle>
            <CardDescription>View your upcoming shifts</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Check your upcoming shifts, request time off, and manage your schedule.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/my-shifts" className="w-full">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                My Shifts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1 border-red-200 dark:border-red-900">
          <CardHeader className="bg-red-50 dark:bg-red-950/30">
            <CardTitle className="flex items-center text-red-700 dark:text-red-400">
              <BarChart3 className="mr-2 h-5 w-5" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>View clinic utilization metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Access clinic utilization statistics, provider hours, and administrative reports.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Recent notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{notification.title}</h3>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm mt-1">{notification.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Notifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
