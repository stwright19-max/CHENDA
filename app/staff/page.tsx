"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, CalendarIcon, AlertCircle } from "lucide-react"

import { FilterBar } from "@/components/filter-bar"
import { ScheduleTable } from "@/components/schedule-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format, addDays, subDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getMAAssignments } from "@/lib/data-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Update the StaffSchedule interface to match your schema
interface StaffSchedule {
  id: number | string
  name: string
  department: string
  location: string
  shift: string // Use shift instead of block for display
  status: string
  assignment: string
}

// Get unique locations for filters
const locations = ["Waltham", "Dedham", "Woburn", "Westboro", "Remote", "Out of Office"]
const departments = ["Clinical", "Administrative", "Coordinator"]

export default function StaffPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0])
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [staffSchedules, setStaffSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [allLocationsData, setAllLocationsData] = useState<any[]>([])

  // Fetch data for the selected location or all locations if searching
  useEffect(() => {
    async function fetchAssignments() {
      setLoading(true)
      setError(null)
      setDebugInfo(null)
      try {
        const dateStr = format(currentDate, "yyyy-MM-dd")

        // If searching, we need data from all locations
        const shouldFetchAllLocations = searchQuery.length > 0

        console.log(
          `Fetching assignments for date: ${dateStr}, ${
            shouldFetchAllLocations ? "all locations" : `location: ${selectedLocation}`
          }`,
        )

        const filters: any = {
          date: dateStr,
        }

        // Only apply location filter if not searching and not in "Out of Office" view
        if (!shouldFetchAllLocations && selectedLocation !== "Out of Office") {
          filters.location = selectedLocation
        }

        const assignments = await getMAAssignments(filters)
        console.log("Fetched assignments:", assignments)

        setDebugInfo({
          fetchedAt: new Date().toISOString(),
          filters,
          assignmentsCount: assignments?.length || 0,
          assignments: assignments?.slice(0, 3) || [],
          isSearching: shouldFetchAllLocations,
        })

        if (!assignments || assignments.length === 0) {
          console.log("No assignments found, using empty array")
          setStaffSchedules([])
          setAllLocationsData([])
          return
        }

        // Transform MA assignments to staff schedules
        const schedules: StaffSchedule[] = assignments.map((assignment: any) => ({
          id: assignment.id,
          name: assignment.ma_name,
          department: "Clinical", // All MAs are in Clinical department
          location: assignment.location,
          shift: assignment.shift || "8:30 AM - 5:00 PM", // Use the standard shift
          status: "On Duty",
          assignment: assignment.provider_name || "Float", // Set "Float" as default if no provider
        }))

        console.log("Transformed schedules:", schedules)

        // If searching, store all data but only display filtered results
        if (shouldFetchAllLocations) {
          setAllLocationsData(schedules)
        } else {
          setStaffSchedules(schedules)
        }
      } catch (error: any) {
        console.error("Error fetching MA assignments:", error)
        setError(error.message || "Failed to load staff schedule")
        // Fallback to empty data
        setStaffSchedules([])
        setAllLocationsData([])
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [currentDate, selectedLocation, searchQuery.length > 0])

  // Apply filters and search to the data
  useEffect(() => {
    // If we're searching, use the all locations data
    const dataToFilter = searchQuery.length > 0 ? allLocationsData : staffSchedules

    const filtered = dataToFilter.filter((staff) => {
      // When searching, we've already fetched all locations, so we don't need to match location
      const locationMatch =
        searchQuery.length > 0
          ? true
          : selectedLocation === "Out of Office"
            ? staff.status === "Off Duty" || staff.status === "On Leave"
            : staff.location === selectedLocation

      const departmentMatch = !selectedDepartment || staff.department === selectedDepartment

      const searchMatch =
        !searchQuery ||
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (staff.assignment && staff.assignment.toLowerCase().includes(searchQuery.toLowerCase()))

      return locationMatch && departmentMatch && searchMatch
    })

    setStaffSchedules(filtered)
  }, [searchQuery, selectedDepartment, allLocationsData])

  // Navigate to previous day
  const goToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1))
  }

  // Navigate to next day
  const goToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1))
  }

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
      setCalendarOpen(false)
    }
  }

  return (
    <main className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Staff Schedule</h1>

      {/* Date Navigation with Calendar Dropdown */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 border p-2 sm:p-3 rounded-md bg-muted/30">
        <Button variant="outline" size="icon" onClick={goToPreviousDay} className="h-8 w-8 sm:h-9 sm:w-9">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-auto justify-start text-left font-normal group hover:bg-muted/50",
                !currentDate && "text-muted-foreground",
              )}
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
                <span className="text-base sm:text-xl font-medium">
                  {format(currentDate, "EEE, MMM d")}
                  <span className="hidden sm:inline">, {format(currentDate, "yyyy")}</span>
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar mode="single" selected={currentDate} onSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="icon" onClick={goToNextDay} className="h-8 w-8 sm:h-9 sm:w-9">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Bar - Full width on mobile */}
      <div className="relative mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff members or providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="mb-4 sm:mb-6">
        <FilterBar
          locations={locations}
          departments={departments}
          selectedLocation={selectedLocation}
          selectedDepartment={selectedDepartment}
          onLocationChange={setSelectedLocation}
          onDepartmentChange={setSelectedDepartment}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {debugInfo && (
        <div className="mb-4 p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <div className="text-sm">
            <p>Fetched at: {debugInfo.fetchedAt}</p>
            <p>
              Filters: Date={debugInfo.filters.date}, Location=
              {debugInfo.filters.location || "Any"}
            </p>
            <p>Search mode: {debugInfo.isSearching ? "Yes (all locations)" : "No (filtered by location)"}</p>
            <p>Assignments found: {debugInfo.assignmentsCount}</p>
            {debugInfo.assignmentsCount > 0 && (
              <details>
                <summary className="cursor-pointer">Sample data (first 3 items)</summary>
                <pre className="mt-2 p-2 bg-muted/30 rounded-md overflow-auto text-xs">
                  {JSON.stringify(debugInfo.assignments, null, 2)}
                </pre>
              </details>
            )}
            <p className="mt-2">Filtered staff count: {staffSchedules.length}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <ScheduleTable
          data={staffSchedules}
          date={currentDate}
          isOutOfOfficeView={selectedLocation === "Out of Office"}
        />
      )}
    </main>
  )
}
