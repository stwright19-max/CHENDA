"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { format, addDays, parseISO } from "date-fns"
import { ChevronLeft, Calendar, MapPin, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample staff data
const staffMembers = {
  "1": {
    id: 1,
    name: "Jon Shaker",
    department: "Clinical",
    title: "Physician Assistant",
  },
  "2": {
    id: 2,
    name: "Jason Rand",
    department: "Administrative",
    title: "Office Manager",
  },
  "3": {
    id: 3,
    name: "Stephen Wright",
    department: "Coordinator",
    title: "Patient Coordinator",
  },
}

// Sample schedule data - two weeks of shifts
const generateSchedule = (staffId: string, startDateStr: string) => {
  // Parse the date string once
  const startDate = startDateStr ? parseISO(startDateStr) : new Date()

  const scheduleData = []
  const locations = ["Waltham", "Dedham", "Woburn", "Westboro", "Remote"]
  const assignments = {
    "1": ["A Provider", "A Provider", "A Provider"],
    "2": ["Front Desk", "Phones", "Front Desk"],
    "3": ["Phones", "Front Desk", "Phones"],
  }
  const shifts = ["9:00 AM - 5:00 PM", "8:00 AM - 4:00 PM", "10:00 AM - 6:00 PM", "12:00 PM - 8:00 PM"]
  const statuses = ["On Duty", "On Duty", "Off Duty", "On Leave", "On Duty"]

  // Use a fixed seed for random generation to ensure consistency
  const seedRandom = (seed: number) => {
    return ((seed * 9301 + 49297) % 233280) / 233280
  }

  // Generate 14 days of schedule
  for (let i = 0; i < 14; i++) {
    const currentDate = addDays(startDate, i)
    const dayOfWeek = format(currentDate, "E")

    // Skip weekends (Saturday and Sunday)
    if (dayOfWeek === "Sat" || dayOfWeek === "Sun") {
      scheduleData.push({
        date: currentDate,
        isWeekend: true,
      })
      continue
    }

    // Use deterministic randomness based on staff ID and date
    const seed = Number.parseInt(staffId) * 100 + i
    const randomValue = seedRandom(seed)

    // Determine if there's a shift this day (80% chance)
    const hasShift = randomValue < 0.8

    if (hasShift) {
      const locationIndex = Math.floor(seedRandom(seed + 1) * locations.length)
      const shiftIndex = Math.floor(seedRandom(seed + 2) * shifts.length)
      const statusIndex = Math.floor(seedRandom(seed + 3) * statuses.length)
      const assignmentOptions = assignments[staffId as keyof typeof assignments] || assignments["1"]
      const assignmentIndex = Math.floor(seedRandom(seed + 4) * assignmentOptions.length)

      scheduleData.push({
        date: currentDate,
        isWeekend: false,
        location: locations[locationIndex],
        shift: shifts[shiftIndex],
        status: statuses[statusIndex],
        assignment: assignmentOptions[assignmentIndex],
      })
    } else {
      scheduleData.push({
        date: currentDate,
        isWeekend: false,
        status: "Off Duty",
      })
    }
  }

  return scheduleData
}

export default function StaffSchedulePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { from?: string }
}) {
  const router = useRouter()
  const fromDateStr = searchParams.from || format(new Date(), "yyyy-MM-dd")
  const isMobile = useMediaQuery("(max-width: 640px)")

  const staffMember = staffMembers[params.id as keyof typeof staffMembers] || {
    id: Number.parseInt(params.id),
    name: "Unknown Staff",
    department: "Unknown",
    title: "Staff Member",
  }

  // Generate schedule data once using useMemo
  const schedule = useMemo(() => {
    return generateSchedule(params.id, fromDateStr)
  }, [params.id, fromDateStr])

  // Parse the from date once for display
  const fromDate = useMemo(() => {
    return fromDateStr ? parseISO(fromDateStr) : new Date()
  }, [fromDateStr])

  // Group schedule by week
  const firstWeek = schedule.slice(0, 7)
  const secondWeek = schedule.slice(7, 14)

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Schedule
      </Button>

      {/* Staff header */}
      <div className="mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold mb-2">{staffMember.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-muted-foreground">
          <div>{staffMember.title}</div>
          <div className="hidden sm:block">•</div>
          <div>{staffMember.department}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Schedule: {format(fromDate, "MMM d")} - {format(addDays(fromDate, 13), "MMM d, yyyy")}
      </h2>

      {/* Schedule view */}
      <Tabs defaultValue="list" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* First week */}
          <div>
            <h3 className="font-medium text-lg mb-3">Week of {format(fromDate, "MMMM d")}</h3>
            <div className="space-y-3">
              {firstWeek.map((day, index) => (
                <ScheduleDay key={index} day={day} isMobile={isMobile} />
              ))}
            </div>
          </div>

          {/* Second week */}
          <div>
            <h3 className="font-medium text-lg mb-3">Week of {format(addDays(fromDate, 7), "MMMM d")}</h3>
            <div className="space-y-3">
              {secondWeek.map((day, index) => (
                <ScheduleDay key={index} day={day} isMobile={isMobile} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center font-medium text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid for first week */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {firstWeek.map((day, index) => (
              <CalendarDay key={index} day={day} />
            ))}
          </div>

          {/* Calendar grid for second week */}
          <div className="grid grid-cols-7 gap-1">
            {secondWeek.map((day, index) => (
              <CalendarDay key={index} day={day} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <div className="border rounded-md p-4 bg-muted/20">
        <h3 className="font-medium mb-2">Status Legend</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500">On Duty</Badge>
          <Badge variant="secondary">Off Duty</Badge>
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            On Leave
          </Badge>
        </div>
      </div>
    </div>
  )
}

// Component for a single day in list view
function ScheduleDay({ day, isMobile }: { day: any; isMobile: boolean }) {
  if (day.isWeekend) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">{format(day.date, "EEEE, MMMM d")}</div>
            <Badge variant="outline">Weekend</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (day.status === "Off Duty" && !day.location) {
    return (
      <Card className="bg-muted/10">
        <CardContent className="p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">{format(day.date, "EEEE, MMMM d")}</div>
            <Badge variant="secondary">Off Duty</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className={isMobile ? "p-3" : "p-4"}>
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium">{format(day.date, "EEEE, MMMM d")}</div>
          <StatusBadge status={day.status} />
        </div>

        {day.location && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{day.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{day.shift}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{day.assignment}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Component for a single day in calendar view
function CalendarDay({ day }: { day: any }) {
  return (
    <div className={`border rounded-md p-2 min-h-[100px] ${day.isWeekend ? "bg-muted/20" : ""}`}>
      <div className="text-sm font-medium mb-1">{format(day.date, "d")}</div>

      {!day.isWeekend && day.location && (
        <div className="space-y-1">
          <StatusBadge status={day.status} />
          <div className="text-xs mt-1">{day.location}</div>
          <div className="text-xs text-muted-foreground">{day.shift}</div>
        </div>
      )}

      {!day.isWeekend && day.status === "Off Duty" && !day.location && (
        <Badge variant="secondary" className="mt-2">
          Off Duty
        </Badge>
      )}

      {day.isWeekend && <div className="text-xs text-muted-foreground">Weekend</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "On Duty":
      return <Badge className="bg-green-500 hover:bg-green-600">On Duty</Badge>
    case "Off Duty":
      return <Badge variant="secondary">Off Duty</Badge>
    case "On Leave":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          On Leave
        </Badge>
      )
    default:
      return null
  }
}
