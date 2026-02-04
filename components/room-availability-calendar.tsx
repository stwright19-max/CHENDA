"use client"

import { format, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface RoomAvailabilityCalendarProps {
  location: string
  date: Date
  rooms: string[]
  schedule: any[]
  onRequestSlot: (slot: any) => void
}

export function RoomAvailabilityCalendar({
  location,
  date,
  rooms,
  schedule,
  onRequestSlot,
}: RoomAvailabilityCalendarProps) {
  if (rooms.length === 0) {
    return <div className="text-center p-8">No rooms available at this location.</div>
  }

  // Group rooms into pairs
  const groupedRooms = rooms.reduce((acc: string[], room: string, index: number) => {
    const roomNumber = Number.parseInt(room.replace("Room ", ""))
    // If it's an odd-numbered room, create a pair
    if (roomNumber % 2 === 1) {
      const nextRoom = `Room ${roomNumber + 1}`
      // Check if the next room exists in the rooms array
      if (rooms.includes(nextRoom)) {
        acc.push(`Room ${roomNumber}/${roomNumber + 1}`)
      } else {
        acc.push(room) // If no pair exists, keep the single room
      }
    }
    return acc
  }, [])

  // Generate time slots for the day (8am to 4pm, excluding 5pm)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 8 // Start at 8am
    return new Date(date).setHours(hour, 0, 0, 0)
  })

  // Check if a room is booked at a specific time
  const getRoomStatus = (room: string, time: number) => {
    const timeDate = new Date(time)
    const roomNumber = Number.parseInt(room.replace("Room ", ""))

    const session = schedule.find(
      (s) =>
        (s.room === room || s.room_number === roomNumber) &&
        isSameDay(new Date(s.startTime), date) &&
        new Date(s.startTime) <= timeDate &&
        new Date(s.endTime) > timeDate,
    )

    if (!session) {
      // Create a slot object for requesting
      const slotStart = new Date(time)
      const slotEnd = new Date(time)
      slotEnd.setHours(slotEnd.getHours() + 1)

      return {
        status: "open",
        session: null,
        requestSlot: {
          room,
          room_number: roomNumber,
          startTime: slotStart.getTime(),
          endTime: slotEnd.getTime(),
          status: "Available",
        },
      }
    }

    return {
      status: session.status === "Available" || session.provider_name === "Open" ? "available" : "booked",
      session,
      requestSlot: session.status === "Available" || session.provider_name === "Open" ? session : null,
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-muted font-medium text-left min-w-[100px]">Room</th>
            {timeSlots.map((time, i) => (
              <th key={i} className="p-2 border bg-muted font-medium text-center min-w-[80px]">
                {format(new Date(time), "h:mm a")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedRooms.map((roomPair, roomIndex) => {
            // Extract room numbers from the pair
            const roomNumbers = roomPair.replace("Room ", "").split("/").map(Number)
            return (
              <tr key={roomIndex}>
                <td className="p-2 border font-medium">{roomPair}</td>
                {timeSlots.map((time, timeIndex) => {
                  // Check status for both rooms in the pair
                  const statuses = roomNumbers.map((roomNum) => {
                    const room = `Room ${roomNum}`
                    return getRoomStatus(room, time)
                  })

                  // Determine combined status (if any room is booked, show as booked)
                  const combinedStatus = statuses.some((s) => s.status === "booked")
                    ? "booked"
                    : statuses.some((s) => s.status === "available")
                      ? "available"
                      : "open"

                  // Use the first non-open slot for display
                  const displaySlot = statuses.find((s) => s.status !== "open") || statuses[0]

                  return (
                    <td
                      key={timeIndex}
                      className={cn(
                        "p-2 border text-center",
                        combinedStatus === "booked" ? "bg-primary/10" : "",
                        combinedStatus === "available" ? "bg-amber-50 dark:bg-amber-950/20" : "",
                      )}
                    >
                      {combinedStatus === "booked" && displaySlot.session?.provider && (
                        <div className="text-xs truncate max-w-[80px]" title={displaySlot.session.provider.name}>
                          {displaySlot.session.provider.name}
                        </div>
                      )}
                      {combinedStatus === "available" && displaySlot.session && (
                        <div className="text-xs text-muted-foreground">Open</div>
                      )}
                      {combinedStatus === "open" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground p-1 h-auto"
                          onClick={() => displaySlot.requestSlot && onRequestSlot(displaySlot.requestSlot)}
                        >
                          Open
                        </Button>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
