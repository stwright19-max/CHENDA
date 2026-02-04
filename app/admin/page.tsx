"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { CalendarIcon, BarChart3, PieChart, Clock, Users, DoorOpen, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Sample data for providers
const providers = [
  { id: 1, name: "Jon Shaker", department: "Clinical", title: "Physician Assistant" },
  { id: 2, name: "Dr. Sarah Johnson", department: "Clinical", title: "Primary Care Physician" },
  { id: 3, name: "Dr. Michael Chen", department: "Clinical", title: "Cardiologist" },
]

// Sample data for rooms
const rooms = {
  Waltham: ["Room 101", "Room 102", "Room 103", "Room 104", "Room 105"],
  Dedham: ["Room 201", "Room 202", "Room 203", "Room 204"],
  Woburn: ["Room 301", "Room 302", "Room 303"],
  Westboro: ["Room 401", "Room 402", "Room 403", "Room 404", "Room 405"],
  Remote: [],
}

// Get total number of rooms
const totalRooms = Object.values(rooms).reduce((acc, locationRooms) => acc + locationRooms.length, 0)

// Generate clinic utilization data
const generateUtilizationData = (date: Date) => {
  // Use date to seed the random generator for consistent results
  const seed = date.getDate() + date.getMonth() * 31
  const seedRandom = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280

  // Today's utilization
  const todayUtilization = Math.floor(seedRandom(seed) * 30) + 60 // 60-90%

  // This week's utilization
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const weeklyUtilization = weekDays.map((day) => {
    const daySeed = day.getDate() + day.getMonth() * 31
    return {
      date: day,
      utilization: Math.floor(seedRandom(daySeed) * 30) + 60, // 60-90%
    }
  })

  // This month's utilization
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const monthlyUtilization = monthDays.map((day) => {
    const daySeed = day.getDate() + day.getMonth() * 31
    return {
      date: day,
      utilization: Math.floor(seedRandom(daySeed) * 30) + 60, // 60-90%
    }
  })

  return {
    today: todayUtilization,
    weekly: weeklyUtilization,
    monthly: monthlyUtilization,
  }
}

// Generate provider clinic hours
const generateProviderHours = (date: Date) => {
  // Use date to seed the random generator for consistent results
  const seed = date.getDate() + date.getMonth() * 31
  const seedRandom = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280

  // This week's hours
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // This month's hours
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)

  return providers.map((provider) => {
    // Weekly data
    const weeklyHours = weekDays.reduce((total, day) => {
      // Skip weekends
      if (day.getDay() === 0 || day.getDay() === 6) return total

      const daySeed = day.getDate() + day.getMonth() * 31 + provider.id
      const hasClinic = seedRandom(daySeed) > 0.3 // 70% chance of having clinic

      return total + (hasClinic ? 8 : 0)
    }, 0)

    const weeklyClinicCount = weekDays.reduce((total, day) => {
      // Skip weekends
      if (day.getDay() === 0 || day.getDay() === 6) return total

      const daySeed = day.getDate() + day.getMonth() * 31 + provider.id
      const hasClinic = seedRandom(daySeed) > 0.3 // 70% chance of having clinic

      return total + (hasClinic ? 1 : 0)
    }, 0)

    // Monthly data (simplified calculation)
    const workDaysInMonth = 22 // Approximate
    const monthlyHours = Math.floor(seedRandom(seed + provider.id) * 40) + 120 // 120-160 hours
    const monthlyClinicCount = Math.floor(monthlyHours / 8) // Assuming 8 hours per clinic

    return {
      ...provider,
      weekly: {
        hours: weeklyHours,
        clinicCount: weeklyClinicCount,
      },
      monthly: {
        hours: monthlyHours,
        clinicCount: monthlyClinicCount,
      },
    }
  })
}

// Generate room utilization data
const generateRoomUtilization = () => {
  const utilization = {}

  for (const [location, locationRooms] of Object.entries(rooms)) {
    if (locationRooms.length === 0) continue

    // Generate a random utilization percentage between 60% and 95%
    const seed = location.charCodeAt(0) + location.length
    const utilizationRate = Math.floor(60 + (seed % 35))

    utilization[location] = utilizationRate
  }

  return utilization
}

// Generate provider utilization data
const generateProviderUtilization = () => {
  const providerData = {}

  for (const location of Object.keys(rooms)) {
    if (location === "Remote") continue
    if (rooms[location].length === 0) continue

    // Generate random utilization data
    const seed = location.charCodeAt(0) + location.length
    const blockUtilization = Math.floor(70 + (seed % 25)) // 70-95%
    const totalReleases = Math.floor(5 + (seed % 10)) // 5-15
    const lateReleases = Math.floor(totalReleases * (0.2 + (seed % 30) / 100)) // 20-50% of total

    providerData[location] = {
      blockUtilization,
      totalReleases,
      lateReleases,
    }
  }

  return providerData
}

export default function AdminPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<"week" | "month">("week")

  // Generate utilization data
  const utilizationData = generateUtilizationData(date)

  // Generate provider hours data
  const providerHoursData = generateProviderHours(date)

  // Generate utilization data
  const roomUtilization = generateRoomUtilization()
  const providerUtilization = generateProviderUtilization()

  // Calculate average utilization for the week
  const weeklyAverageUtilization = Math.round(
    utilizationData.weekly.reduce((sum, day) => sum + day.utilization, 0) / utilizationData.weekly.length,
  )

  // Calculate average utilization for the month
  const monthlyAverageUtilization = Math.round(
    utilizationData.monthly.reduce((sum, day) => sum + day.utilization, 0) / utilizationData.monthly.length,
  )

  // Calculate total provider hours
  const totalWeeklyHours = providerHoursData.reduce((sum, provider) => sum + provider.weekly.hours, 0)
  const totalMonthlyHours = providerHoursData.reduce((sum, provider) => sum + provider.monthly.hours, 0)

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
      {/* Header with date selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
          <div className="text-muted-foreground">Clinic utilization and provider statistics</div>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-2">
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
              <Calendar
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

          <div className="flex gap-1">
            <Button
              variant={timeframe === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("week")}
            >
              Week
            </Button>
            <Button
              variant={timeframe === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("month")}
            >
              Month
            </Button>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Utilization</p>
              <p className="text-3xl font-bold">{utilizationData.today}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((utilizationData.today * totalRooms) / 100)} of {totalRooms} rooms in use
              </p>
            </div>
            <PieChart className="h-8 w-8 text-muted-foreground/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {timeframe === "week" ? "Weekly" : "Monthly"} Average
              </p>
              <p className="text-3xl font-bold">
                {timeframe === "week" ? weeklyAverageUtilization : monthlyAverageUtilization}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {timeframe === "week"
                  ? `${format(startOfWeek(date, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(date, { weekStartsOn: 1 }), "MMM d")}`
                  : format(date, "MMMM yyyy")}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Provider Clinic Hours</p>
              <p className="text-3xl font-bold">{timeframe === "week" ? totalWeeklyHours : totalMonthlyHours}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {timeframe === "week"
                  ? `${providerHoursData.reduce((sum, p) => sum + p.weekly.clinicCount, 0)} clinics this week`
                  : `${providerHoursData.reduce((sum, p) => sum + p.monthly.clinicCount, 0)} clinics this month`}
              </p>
            </div>
            <Clock className="h-8 w-8 text-muted-foreground/60" />
          </CardContent>
        </Card>
      </div>

      {/* Utilization Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Room Utilization</CardTitle>
          <CardDescription>
            {timeframe === "week"
              ? `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMMM d, yyyy")}`
              : format(date, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {/* Simplified chart visualization */}
            <div className="flex h-full items-end gap-2">
              {(timeframe === "week" ? utilizationData.weekly : utilizationData.monthly.slice(0, 30)).map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className={cn(
                      "w-full rounded-t-sm",
                      isSameDay(day.date, new Date()) ? "bg-primary" : "bg-primary/70",
                    )}
                    style={{ height: `${day.utilization * 2.5}px` }}
                  />
                  <div className="text-xs mt-2 text-muted-foreground">
                    {format(day.date, timeframe === "week" ? "EEE" : "d")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Utilization by Location */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DoorOpen className="mr-2 h-5 w-5" />
            Room Utilization by Location
          </CardTitle>
          <CardDescription>
            {timeframe === "week"
              ? `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMMM d, yyyy")}`
              : format(date, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(roomUtilization).map(([location, utilization]) => (
              <div key={location} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{location}</span>
                  </div>
                  <span className="font-medium">{utilization}%</span>
                </div>
                <Progress
                  value={utilization as number}
                  className={cn("h-2", (utilization as number) > 85 ? "bg-muted text-green-500" : "bg-muted")}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Utilization Metrics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Provider Utilization Metrics
          </CardTitle>
          <CardDescription>
            {timeframe === "week"
              ? `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMMM d, yyyy")}`
              : format(date, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Location</th>
                  <th className="text-center py-2 px-3">Block Utilization</th>
                  <th className="text-center py-2 px-3">Total Releases</th>
                  <th className="text-center py-2 px-3">Late Releases (≤2 weeks)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(providerUtilization).map(([location, data]) => (
                  <tr key={location} className="border-b">
                    <td className="py-3 px-3 font-medium">{location}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <Progress
                          value={data.blockUtilization}
                          className={cn(
                            "h-2 w-24",
                            data.blockUtilization > 85 ? "bg-muted text-green-500" : "bg-muted",
                          )}
                        />
                        <span>{data.blockUtilization}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">{data.totalReleases}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className="text-amber-500 border-amber-500">
                        {data.lateReleases}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Provider Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Provider Clinic Hours
          </CardTitle>
          <CardDescription>
            {timeframe === "week"
              ? `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMMM d, yyyy")}`
              : format(date, "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Provider</th>
                  <th className="text-left py-3 px-2">Title</th>
                  <th className="text-right py-3 px-2">Clinic Count</th>
                  <th className="text-right py-3 px-2">Hours</th>
                  <th className="text-right py-3 px-2">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {providerHoursData.map((provider) => {
                  const data = timeframe === "week" ? provider.weekly : provider.monthly
                  const maxHours = timeframe === "week" ? 40 : 160 // Assuming 40 hours per week, 160 per month
                  const utilization = Math.round((data.hours / maxHours) * 100)

                  return (
                    <tr key={provider.id} className="border-b">
                      <td className="py-3 px-2 font-medium">{provider.name}</td>
                      <td className="py-3 px-2 text-muted-foreground">{provider.title}</td>
                      <td className="py-3 px-2 text-right">{data.clinicCount}</td>
                      <td className="py-3 px-2 text-right">{data.hours}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${utilization}%` }} />
                          </div>
                          <span>{utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
