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
import { Loader2, UserPlus } from "lucide-react"

interface MA {
  id: string
  name: string
  available?: boolean
}

interface AssignMADialogProps {
  providerId?: string
  providerName?: string
  date?: string
  time?: string
  location?: string
  availableMAs?: MA[]
  onAssign?: (maId: string, notes: string) => Promise<void>
  trigger?: React.ReactNode
}

export function AssignMADialog({
  providerId,
  providerName = "Provider",
  date = "Selected date",
  time = "Selected time",
  location = "Location",
  availableMAs = [],
  onAssign,
  trigger,
}: AssignMADialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedMA, setSelectedMA] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAssign = async () => {
    if (!selectedMA) {
      toast({
        title: "Error",
        description: "Please select a medical assistant",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      if (onAssign) {
        await onAssign(selectedMA, notes)
      } else {
        // Mock assignment if no handler is provided
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast({
          title: "MA Assigned",
          description: `Successfully assigned MA to ${providerName}`,
        })
      }

      setOpen(false)
      setSelectedMA("")
      setNotes("")
    } catch (error) {
      console.error("Error assigning MA:", error)
      toast({
        title: "Error",
        description: "Failed to assign medical assistant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign MA
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Medical Assistant</DialogTitle>
          <DialogDescription>
            Assign an MA to {providerName} on {date} at {time} ({location})
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ma">Medical Assistant</Label>
            <Select value={selectedMA} onValueChange={setSelectedMA}>
              <SelectTrigger id="ma">
                <SelectValue placeholder="Select an MA" />
              </SelectTrigger>
              <SelectContent>
                {availableMAs.length > 0 ? (
                  availableMAs.map((ma) => (
                    <SelectItem key={ma.id} value={ma.id} disabled={ma.available === false}>
                      {ma.name} {ma.available === false && "(Unavailable)"}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-mas" disabled>
                    No MAs available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or notes"
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isLoading || !selectedMA}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign MA"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
