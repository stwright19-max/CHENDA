"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, MapPin, Clock, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ClinicSlot } from "@/lib/data-service"

interface ClinicSlotCardProps {
  slot: ClinicSlot
  onAssignMA: (slotId: string) => void
  onRequestSlot: (slotId: string) => void
  onReleaseSlot: (slotId: string) => void
}

export function ClinicSlotCard({ slot, onAssignMA, onRequestSlot, onReleaseSlot }: ClinicSlotCardProps) {
  const isAvailable = slot.status === "Available"
  const isScheduled = slot.status === "Scheduled"

  return (
    <Card className={`overflow-hidden ${isAvailable ? "border-dashed" : ""}`}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
          <div>
            <div className="font-medium">{isAvailable ? "Open" : slot.provider_name}</div>
            <div className="text-sm text-muted-foreground">
              {slot.room_number ? `Room ${slot.room_number}` : "No Room"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={slot.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAvailable && (
                  <DropdownMenuItem onClick={() => onRequestSlot(slot.id)}>Request Slot</DropdownMenuItem>
                )}
                {isScheduled && (
                  <DropdownMenuItem onClick={() => onReleaseSlot(slot.id)}>Release Slot</DropdownMenuItem>
                )}
                {isScheduled && <DropdownMenuItem onClick={() => onAssignMA(slot.id)}>Assign MA</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{new Date(slot.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{slot.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{slot.block === "AM" ? "Morning" : "Afternoon"}</span>
          </div>
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>MA: {slot.ma_assigned || "Unassigned"}</span>
          </div>
          {slot.notes && (
            <div className="text-sm mt-2 p-2 bg-muted/30 rounded-md">
              <div className="font-medium text-xs text-muted-foreground mb-1">Notes</div>
              {slot.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Available":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600 font-medium">
          Available
        </Badge>
      )
    case "Scheduled":
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
          Scheduled
        </Badge>
      )
    case "Cancelled":
      return (
        <Badge variant="secondary" className="bg-slate-500 text-white">
          Cancelled
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          {status}
        </Badge>
      )
  }
}
