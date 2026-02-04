"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon, Filter } from "lucide-react"
import { format, addDays, subDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ClinicSlotCard } from "@/components/clinic-slot"
import { getClinicSlots, type ClinicSlot } from "@/lib/data-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterSidebar } from "@/components/filter-sidebar"
import { AssignMADialog } from "@/components/assign-ma-dialog"
import { RequestSlotDialog } from "@/components/request-slot-dialog"
import { ReleaseSlotDialog } from "@/components/release-slot-dialog"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [clinicSlots, setClinicSlots] = useState<ClinicSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string>("Waltham")
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [isAssignMAOpen, setIsAssignMAOpen] = useState(false)
  const [isRequestSlotOpen, setIsRequestSlotOpen] = useState(false)
  const [isReleaseSlotOpen, setIsReleaseSlotOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Fetch clinic slots
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const dateStr = format(currentDate, "yyyy-MM-dd")

        // Fetch clinic slots with MA assignments already linked
        const slots = await getClinicSlots({
          date: dateStr,
          location: selectedLocation,
          block: selectedBlock || undefined,
          status: selectedStatus || undefined,
        })

        setClinicSlots(slots)

        // Add debug info
        setDebugInfo({
          fetchedAt: new Date().toISOString(),
          date: dateStr,
          location: selectedLocation,
          block: selectedBlock || "All",
          status: selectedStatus || "All",
          slotsCount: slots.length,
          slotsWithMA: slots.filter((s) => s.ma_assigned).length,
          sampleSlots: slots.slice(0, 3),
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentDate, selectedLocation, selectedBlock, selectedStatus])

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

  // Handle assigning MA to a clinic slot
  const handleAssignMA = (slotId: string) => {
    setSelectedSlotId(slotId)
    setIsAssignMAOpen(true)
  }

  // Handle requesting a clinic slot
  const handleRequestSlot = (slotId: string) => {
    setSelectedSlotId(slotId)
    setIsRequestSlotOpen(true)
  }

  // Handle releasing a clinic slot
  const handleReleaseSlot = (slotId: string) => {
    setSelectedSlotId(slotId)
    setIsReleaseSlotOpen(true)
  }

  // Filter clinic slots based on selected filters
  const filteredSlots = clinicSlots.filter((slot) => {
    const blockMatch = !selectedBlock || slot.block === selectedBlock
    const statusMatch = !selectedStatus || slot.status === selectedStatus
    return blockMatch && statusMatch
  })

  return (
    <main className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Clinic Schedule</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Filter clinic slots by various criteria.</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <FilterSidebar
                selectedLocation={selectedLocation}
                selectedBlock={selectedBlock}
                selectedStatus={selectedStatus}
                onLocationChange={setSelectedLocation}
                onBlockChange={setSelectedBlock}
                onStatusChange={setSelectedStatus}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Filters Button */}
      <div className="sm:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Filter clinic slots by various criteria.</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <FilterSidebar
                selectedLocation={selectedLocation}
                selectedBlock={selectedBlock}
                selectedStatus={selectedStatus}
                onLocationChange={setSelectedLocation}
                onBlockChange={setSelectedBlock}
                onStatusChange={setSelectedStatus}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Date Navigation with Calendar Dropdown */}
      <div className="flex items-center justify-between mb-6 border p-2 sm:p-3 rounded-md bg-muted/30">
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

      {/* Debug Information */}
      {debugInfo && (
        <div className="mb-4 p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <div className="text-sm">
            <p>Fetched at: {debugInfo.fetchedAt}</p>
            <p>
              Filters: Date={debugInfo.date}, Location={debugInfo.location}, Block={debugInfo.block}, Status=
              {debugInfo.status}
            </p>
            <p>Total slots: {debugInfo.slotsCount}</p>
            <p>Slots with MA assigned: {debugInfo.slotsWithMA}</p>
            {debugInfo.sampleSlots && debugInfo.sampleSlots.length > 0 && (
              <details>
                <summary className="cursor-pointer">Sample slots (first 3)</summary>
                <pre className="mt-2 p-2 bg-muted/30 rounded-md overflow-auto text-xs">
                  {JSON.stringify(debugInfo.sampleSlots, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Clinic Slots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      ) : filteredSlots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSlots.map((slot) => (
            <ClinicSlotCard
              key={slot.id}
              slot={slot}
              onAssignMA={handleAssignMA}
              onRequestSlot={handleRequestSlot}
              onReleaseSlot={handleReleaseSlot}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md">No clinic slots found for the selected criteria.</div>
      )}

      {/* Assign MA Dialog */}
      <AssignMADialog
        open={isAssignMAOpen}
        onOpenChange={setIsAssignMAOpen}
        slotId={selectedSlotId}
        onSuccess={() => {
          // Refresh data after successful assignment
          const dateStr = format(currentDate, "yyyy-MM-dd")
          getClinicSlots({
            date: dateStr,
            location: selectedLocation,
            block: selectedBlock || undefined,
            status: selectedStatus || undefined,
          }).then(setClinicSlots)
        }}
      />

      {/* Request Slot Dialog */}
      <RequestSlotDialog
        open={isRequestSlotOpen}
        onOpenChange={setIsRequestSlotOpen}
        slotId={selectedSlotId}
        onSuccess={() => {
          // Refresh data after successful request
          const dateStr = format(currentDate, "yyyy-MM-dd")
          getClinicSlots({
            date: dateStr,
            location: selectedLocation,
            block: selectedBlock || undefined,
            status: selectedStatus || undefined,
          }).then(setClinicSlots)
        }}
      />

      {/* Release Slot Dialog */}
      <ReleaseSlotDialog
        open={isReleaseSlotOpen}
        onOpenChange={setIsReleaseSlotOpen}
        slotId={selectedSlotId}
        onSuccess={() => {
          // Refresh data after successful release
          const dateStr = format(currentDate, "yyyy-MM-dd")
          getClinicSlots({
            date: dateStr,
            location: selectedLocation,
            block: selectedBlock || undefined,
            status: selectedStatus || undefined,
          }).then(setClinicSlots)
        }}
      />
    </main>
  )
}
