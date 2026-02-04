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
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, CalendarX, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ReleaseSlotDialogProps {
  slotId?: string
  providerName?: string
  date?: string
  time?: string
  location?: string
  onRelease?: (reason: string, notes: string) => Promise<void>
  trigger?: React.ReactNode
}

export function ReleaseSlotDialog({
  slotId,
  providerName = "Provider",
  date = "Selected date",
  time = "Selected time",
  location = "Location",
  onRelease,
  trigger,
}: ReleaseSlotDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)

  const handleRelease = async () => {
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select a reason for releasing this slot",
        variant: "destructive",
      })
      return
    }

    if (!confirmRelease) {
      setConfirmRelease(true)
      return
    }

    try {
      setIsLoading(true)

      if (onRelease) {
        await onRelease(reason, notes)
      } else {
        // Mock release if no handler is provided
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast({
          title: "Slot Released",
          description: `Successfully released slot for ${providerName}`,
        })
      }

      setOpen(false)
      setReason("")
      setNotes("")
      setConfirmRelease(false)
    } catch (error) {
      console.error("Error releasing slot:", error)
      toast({
        title: "Error",
        description: "Failed to release time slot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const reasons = [
    { id: "vacation", label: "Vacation/Time Off" },
    { id: "sick", label: "Sick Leave" },
    { id: "meeting", label: "Meeting/Conference" },
    { id: "personal", label: "Personal Reasons" },
    { id: "other", label: "Other" },
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          setConfirmRelease(false)
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
            <CalendarX className="h-4 w-4 mr-2" />
            Release Slot
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Release Time Slot</DialogTitle>
          <DialogDescription>
            Release the slot for {providerName} on {date} at {time} ({location})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {confirmRelease && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Confirm Release</AlertTitle>
              <AlertDescription>
                Are you sure you want to release this slot? This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Release</Label>
            <Select value={reason} onValueChange={setReason} disabled={isLoading || confirmRelease}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasons.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional details"
              className="resize-none"
              disabled={isLoading || confirmRelease}
            />
          </div>
        </div>
        <DialogFooter>
          {confirmRelease ? (
            <>
              <Button variant="outline" onClick={() => setConfirmRelease(false)} disabled={isLoading}>
                Back
              </Button>
              <Button variant="destructive" onClick={handleRelease} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Releasing...
                  </>
                ) : (
                  "Confirm Release"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleRelease} disabled={isLoading || !reason}>
                Continue
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
