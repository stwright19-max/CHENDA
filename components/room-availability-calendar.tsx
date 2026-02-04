"use client"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ROOM_CONFIGS, 
  getScheduleForDate, 
  getDayAbbreviation,
  type Location 
} from "@/lib/block-schedule-data"

interface RoomAvailabilityCalendarProps {
  location: string
  date: Date
}

export function RoomAvailabilityCalendar({
  location,
  date,
}: RoomAvailabilityCalendarProps) {
  const rooms = ROOM_CONFIGS[location as Location] || []
  
  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No rooms configured for {location}
        </CardContent>
      </Card>
    )
  }

  // Get the schedule for the selected date
  const { weekNumber, entries } = getScheduleForDate(date)
  const dayOfWeek = getDayAbbreviation(date)
  
  // Check if this is a weekend
  const isWeekend = dayOfWeek === "Sat" || dayOfWeek === "Sun"
  
  if (isWeekend) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Room Assignments - {location}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(date, "EEEE, MMMM d, yyyy")}
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No block schedule available for weekends
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get entries for this location and day
  const locationEntries = entries.filter(
    (entry) => entry.location === location && entry.dayOfWeek === dayOfWeek
  )

  const amEntry = locationEntries.find((e) => e.block === "AM")
  const pmEntry = locationEntries.find((e) => e.block === "PM")

  // Helper to get cell styling based on provider
  const getCellStyle = (provider: string) => {
    if (provider === "Open") {
      return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
    }
    if (provider === "N/A") {
      return "bg-muted/50 text-muted-foreground italic"
    }
    return "bg-primary/5 text-foreground font-medium"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg">Room Assignments - {location}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(date, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Week {weekNumber} of month
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-3 border bg-muted font-semibold text-left min-w-[120px]">
                  Room
                </th>
                <th className="p-3 border bg-muted font-semibold text-center min-w-[150px]">
                  AM (8:00 - 12:00)
                </th>
                <th className="p-3 border bg-muted font-semibold text-center min-w-[150px]">
                  PM (1:00 - 5:00)
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const amProvider = amEntry?.rooms[room] || "-"
                const pmProvider = pmEntry?.rooms[room] || "-"
                
                return (
                  <tr key={room} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 border font-medium whitespace-nowrap">
                      {room}
                    </td>
                    <td className={cn("p-3 border text-center", getCellStyle(amProvider))}>
                      {amProvider}
                    </td>
                    <td className={cn("p-3 border text-center", getCellStyle(pmProvider))}>
                      {pmProvider}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-700 rounded" />
            <span className="text-muted-foreground">Open - Available for booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted/50 border rounded" />
            <span className="text-muted-foreground">N/A - Not available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/10 border rounded" />
            <span className="text-muted-foreground">Provider assigned</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
