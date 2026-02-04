"use client"

import type React from "react"

import { useState } from "react"
import { format, addDays, isBefore } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function TimeOffRequestForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date | undefined
  }>({
    from: addDays(new Date(), 7),
    to: addDays(new Date(), 9),
  })
  const [reason, setReason] = useState("")

  // Validate the form
  const isValid = dateRange.from && dateRange.to && reason.trim().length > 0

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Show success message
      toast({
        title: "Time-off request submitted",
        description: `Your request for ${format(dateRange.from, "MMM d")} - ${format(dateRange.to!, "MMM d")} has been submitted.`,
      })

      // Reset form
      setReason("")

      // Refresh the page to show the new request
      router.refresh()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="date-range">Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-range"
                variant="outline"
                className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange({ from: date || new Date(), to: dateRange.to })}
                disabled={(date) => isBefore(date, new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                disabled={(date) => isBefore(date, dateRange.from || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          placeholder="Please provide a reason for your time-off request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  )
}
