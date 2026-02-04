"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { CalendarPlus, Loader2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Location {
  id: string
  name: string
}

interface TimeSlot {
  id: string
  time: string
  available?: boolean
}

interface RequestSlotDialogProps {
  locations?: Location[]
  timeSlots?: TimeSlot[]
  onRequest?: (date: Date, timeSlotId: string, locationId: string, notes: string) => Promise<void>
  trigger?: React.ReactNode
}

export function RequestSlotDialog({ locations = [], timeSlots = [], onRequest, trigger }: RequestSlotDialogProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRequest = async () => {
    if (!date || !selectedTimeSlot || !selectedLocation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      if (onRequest) {
        await onRequest(date, selectedTimeSlot, selectedLocation, notes)
      } else {
        // Mock request if no handler is provided
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast({
          title: "Slot Requested",
          description: `Successfully requested slot for ${format(date, "PPP")}`,
        })
      }

      setOpen(false)
      setDate(undefined)
      setSelectedTimeSlot("")
      setSelectedLocation("")
      setNotes("")
    } catch (error) {
      console.error("Error requesting slot:", error)
      toast({
        title: "Error",
        description: "Failed to request time slot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Default locations if none provided
  const defaultLocations: Location[] =
    locations.length > 0
      ? locations
      : [
          { id: "waltham", name: "Waltham" },
          { id: "dedham", name: "Dedham" },
          { id: "woburn", name: "Woburn" },
          { id: "westboro", name: "Westboro" },
        ]

  // Default time slots if none provided
  const defaultTimeSlots: TimeSlot[] =
    timeSlots.length > 0
      ? timeSlots
      : [
          { id: "morning", time: "Morning (8:00 AM - 12:00 PM)" },
          { id: "afternoon", time: "Afternoon (12:00 PM - 5:00 PM)" },
        ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Request Slot
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Time Slot</DialogTitle>
          <DialogDescription>Request a new time slot for your schedule</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time-slot">Time Slot</Label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger id="time-slot">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {defaultTimeSlots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id} disabled={slot.available === false}>
                    {slot.time} {slot.available === false && "(Unavailable)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {defaultLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special requests or notes"
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRequest} disabled={isLoading || !date || !selectedTimeSlot || !selectedLocation}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              "Request Slot"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
