"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface FilterBarProps {
  locations: string[]
  departments: string[]
  selectedLocation: string
  selectedDepartment: string | null
  onLocationChange: (location: string) => void
  onDepartmentChange: (department: string | null) => void
}

export function FilterBar({
  locations,
  departments,
  selectedLocation,
  selectedDepartment,
  onLocationChange,
  onDepartmentChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Horizontal scrollable location filter */}
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

      {/* Department Filter */}
      <div className="flex items-center">
        <span className="text-sm font-medium mr-2">Department:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm sm:h-8">
              {selectedDepartment || "All Departments"}
              {selectedDepartment && (
                <Badge variant="secondary" className="ml-2 rounded-sm">
                  {selectedDepartment}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter by department</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={!selectedDepartment ? "bg-muted" : ""}
              onClick={() => onDepartmentChange(null)}
            >
              All Departments
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {departments.map((department) => (
                <DropdownMenuItem
                  key={department}
                  className={selectedDepartment === department ? "bg-muted" : ""}
                  onClick={() => onDepartmentChange(department)}
                >
                  {department}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
