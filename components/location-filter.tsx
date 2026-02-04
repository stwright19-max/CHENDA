"use client"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface LocationFilterProps {
  locations: string[]
  selectedLocation: string
  onLocationChange: (location: string) => void
}

export function LocationFilter({ locations, selectedLocation, onLocationChange }: LocationFilterProps) {
  return (
    <div className="border-b pb-3 sm:pb-4">
      <h3 className="text-sm font-medium mb-2">Location</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-1">
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? "default" : "outline"}
              size="sm"
              onClick={() => onLocationChange(location)}
              className={cn(
                "flex-shrink-0 h-8 text-xs sm:text-sm sm:h-9",
                location === "Out of Office" && selectedLocation === location && "bg-amber-500 hover:bg-amber-600",
              )}
            >
              {location}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
