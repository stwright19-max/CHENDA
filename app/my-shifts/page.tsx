"use client"

import { useState, useMemo } from "react"
import { format, addDays, parseISO, startOfWeek } from "date-fns"
import { CalendarIcon, Clock, MapPin, Calendar, Plus, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { TimeOffRequestForm } from "@/components/time-off-request-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Mock logged-in user
const currentUser = {
  id: 1,
  name: "Jon Shaker",
  department: "Clinical",
  title: "Physician Assistant",
  pto: {
    total: 160,
    used: 48,
    scheduled: 16,
    remaining: 96,
  },
}

// Generate sample schedule data for the current user
const generateUserSchedule = (startDateStr: string) => {
  const startDate = startDateStr ? parseISO(startDateStr) : new Date()
  const scheduleData = []
  const locations = ["Waltham", "Dedham", "Woburn", "Westboro", "Remote"]
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

    // Use deterministic randomness based on date
    const seed = currentUser.id * 100 + i
    const randomValue = seedRandom(seed)

    // Determine if there's a shift this day (80% chance)
    const hasShift = randomValue < 0.8

    if (hasShift) {
      const locationIndex = Math.floor(seedRandom(seed + 1) * locations.length)
      const shiftIndex = Math.floor(seedRandom(seed + 2) * shifts.length)
      const statusIndex = Math.floor(seedRandom(seed + 3) * statuses.length)

      scheduleData.push({
        date: currentDate,
        isWeekend: false,
        location: locations[locationIndex],
        shift: shifts[shiftIndex],
        status: statuses[statusIndex],
        assignment: "A Provider",
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

// Sample pending time-off requests
const pendingTimeOffRequests = [
  {
    id: 1,
    startDate: addDays(new Date(), 10),
    endDate: addDays(new Date(), 12),
    reason: "Family vacation",
    status: "Pending",
  },
]

export default function MyShiftsPage({
  searchParams,
}: {
  searchParams: { from?: string }
}) {
  const fromDateStr = searchParams.from || format(new Date(), "yyyy-MM-dd")
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(fromDateStr ? parseISO(fromDateStr) : new Date())

  // Generate schedule data once using useMemo
  const schedule = useMemo(() => {
    return generateUserSchedule(fromDateStr)
  }, [fromDateStr])

  // Parse the from date once for display
  const fromDate = useMemo(() => {
    return fromDateStr ? parseISO(fromDateStr) : new Date()
  }, [fromDateStr])

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setCalendarOpen(false)
    }
  }

  // Group schedule by week
  const firstWeek = schedule.slice(0, 7)
  const secondWeek = schedule.slice(7, 14)

  // Calculate PTO percentages
  const ptoUsedPercent = Math.round((currentUser.pto.used / currentUser.pto.total) * 100)
  const ptoScheduledPercent = Math.round((currentUser.pto.scheduled / currentUser.pto.total) * 100)
  const ptoRemainingPercent = Math.round((currentUser.pto.remaining / currentUser.pto.total) * 100)

  // Get the days of the week starting from Monday
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Upcoming Shifts</h1>
          <div className="text-muted-foreground">View and manage your schedule</div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Request Time Off
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
              <DialogDescription>
                Submit a request for time off. You'll be notified when it's approved.
              </DialogDescription>
            </DialogHeader>
            <TimeOffRequestForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* PTO Information */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            PTO Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">Total PTO</div>
              <div className="font-bold">{currentUser.pto.total} hours</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">Used</div>
                <div className="text-sm">
                  {currentUser.pto.used} hours ({ptoUsedPercent}%)
                </div>
              </div>
              <Progress value={ptoUsedPercent} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm">Scheduled</div>
                <div className="text-sm">
                  {currentUser.pto.scheduled} hours ({ptoScheduledPercent}%)
                </div>
              </div>
              <Progress value={ptoScheduledPercent} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Remaining</div>
                <div className="text-sm font-medium">
                  {currentUser.pto.remaining} hours ({ptoRemainingPercent}%)
                </div>
              </div>
              <Progress value={ptoRemainingPercent} className="h-2 bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date selector */}
      <div className="mb-6 flex items-center">
        <div className="mr-2 text-sm font-medium">Viewing from:</div>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn("justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Pending time-off requests */}
      {pendingTimeOffRequests.length > 0 && (
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardHeader className="py-3">
            <CardTitle className="text-base font-medium">Pending Time-Off Requests</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {pendingTimeOffRequests.map((request) => (
              <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-medium">
                    {format(request.startDate, "MMM d")} - {format(request.endDate, "MMM d, yyyy")}
                  </span>
                  <div className="text-sm text-muted-foreground">{request.reason}</div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {request.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
          {/* Calendar header - days of the week */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* First week - calculate offset for proper alignment */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {(() => {
              // Get the start of the week (Monday) for the first date
              const weekStart = startOfWeek(fromDate, { weekStartsOn: 1 })

              // Calculate how many days to offset
              const offset = Math.round((fromDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24))

              // Create empty cells for offset
              const offsetCells = Array.from({ length: offset }, (_, i) => (
                <div key={`offset-${i}`} className="border rounded-md p-2 min-h-[100px] bg-muted/10"></div>
              ))

              // Create cells for actual days, limited to 7 - offset
              const dayCells = firstWeek.slice(0, 7 - offset).map((day, index) => <CalendarDay key={index} day={day} />)

              return [...offsetCells, ...dayCells]
            })()}
          </div>

          {/* Second week */}
          <div className="grid grid-cols-7 gap-1">
            {(() => {
              // Get remaining days from first week
              const remainingFirstWeek = firstWeek.slice(7 - (fromDate.getDay() === 0 ? 7 : fromDate.getDay()))

              // Get days from second week to fill the grid
              const secondWeekDays = secondWeek.slice(0, 7 - remainingFirstWeek.length)

              return [...remainingFirstWeek, ...secondWeekDays].map((day, index) => (
                <CalendarDay key={index} day={day} />
              ))
            })()}
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
