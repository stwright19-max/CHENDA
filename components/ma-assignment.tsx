"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { assignMAToClinicSlot } from "@/lib/data-service"

interface MAAssignmentProps {
  slotId: string
  currentMA: string | null
  medicalAssistants: { id: number; name: string }[]
  onAssignmentComplete?: () => void
  className?: string
}

export function MAAssignment({
  slotId,
  currentMA,
  medicalAssistants,
  onAssignmentComplete,
  className,
}: MAAssignmentProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedMA, setSelectedMA] = useState<string | null>(currentMA)

  const handleAssignMA = async (maName: string) => {
    if (maName === currentMA) {
      setOpen(false)
      return
    }

    try {
      setLoading(true)
      await assignMAToClinicSlot(slotId, maName)
      setSelectedMA(maName)
      toast({
        title: "Success",
        description: `Assigned ${maName} to this slot`,
      })
      if (onAssignmentComplete) {
        onAssignmentComplete()
      }
    } catch (error) {
      console.error("Error assigning MA:", error)
      toast({
        title: "Error",
        description: "Failed to assign MA. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {selectedMA || "Assign MA"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search MA..." />
            <CommandList>
              <CommandEmpty>No MA found.</CommandEmpty>
              <CommandGroup>
                {medicalAssistants.map((ma) => (
                  <CommandItem key={ma.id} value={ma.name} onSelect={() => handleAssignMA(ma.name)}>
                    <Check className={cn("mr-2 h-4 w-4", selectedMA === ma.name ? "opacity-100" : "opacity-0")} />
                    {ma.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
