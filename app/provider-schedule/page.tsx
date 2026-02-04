"use client"

import React from "react"

import { useState, useEffect } from "react"
import { format, addDays, parseISO } from "date-fns"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  DoorOpen,
  CalendarPlus,
  Plus,
  X,
  Filter,
  Loader2,
  RefreshCw,
  Printer,
  Download,
  Grid3X3,
  List,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { LocationFilter } from "@/components/location-filter"
import { RoomAvailabilityCalendar } from "@/components/room-availability-calendar"
import {
  getClinicSlots,
  getLocations,
  getMedicalAssistants,
  getCoordinators,
  getProviders,
  getRoomsByLocation,
  requestClinicSlot,
  releaseClinicSlot,
} from "@/lib/data-service"
import { toast } from "@/components/ui/use-toast"
import { ProviderFilter } from "@/components/provider-filter"
import { PrintSchedule } from "@/components/print-schedule"
import { BLOCK_SCHEDULE, ROOM_CONFIGS, DAYS_OF_WEEK, type Location } from "@/lib/block-schedule-data"
import { formatClinicSlotsForExport, exportToCSV } from "@/lib/export-utils" // Import missing functions

export default function ProviderSchedulePage() {
  const [clinicSlots, setClinicSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [showRoomAvailability, setShowRoomAvailability] = useState(true)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>("1")
  const [requestNotes, setRequestNotes] = useState("")
  const [releaseReason, setReleaseReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string | null>(null)
  const [showPrintView, setShowPrintView] = useState(false)
  const [rawData, setRawData] = useState<any[]>([])
  const [showBlockSchedule, setShowBlockSchedule] = useState(false)

  // Get providers, MAs, and coordinators
  const providers = getProviders()
  const medicalAssistants = getMedicalAssistants()
  const coordinators = getCoordinators()
  const roomsByLocation = getRoomsByLocation()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch locations
        const locs = await getLocations()
        setLocations(locs)

        // Set default location if none selected
        if (!selectedLocation && locs.length > 0) {
          setSelectedLocation(locs[0])
        }

        // Fetch clinic slots
        await fetchClinicSlots()
      } catch (error) {
        console.error("Error fetching data:", error)
        setDebugInfo(`Error fetching data: ${error}`)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchClinicSlots = async () => {
    try {
      setLoading(true)
      setDebugInfo("Fetching clinic slots...")

      const filters: any = {}

      if (selectedLocation) {
        filters.location = selectedLocation
      }

      // Use the current date for filtering
      filters.date = format(currentDate, "yyyy-MM-dd")

      const data = await getClinicSlots(filters)
      console.log("Raw clinic slots data:", data)
      setRawData(data) // Store the raw data for debugging
      setDebugInfo((prev) => `${prev}\nFetched ${data.length} raw clinic slots`)

      // Transform data to match the expected format
      const transformedData = data.map((slot: any) => {
        console.log("Processing slot:", slot)

        // Get start and end times based on block
        const startTime = getStartTimeFromBlock(slot.date, slot.block)
        const endTime = getEndTimeFromBlock(slot.date, slot.block)

        // Determine if the slot is available
        const isAvailable = slot.provider_name === "Open" || slot.status === "Available"

        const transformedSlot = {
          id: slot.id,
          provider: isAvailable
            ? null
            : {
                name: slot.provider_name,
                title: getProviderTitle(slot.provider_name),
              },
          provider_name: slot.provider_name,
          medicalAssistant: slot.ma_assigned ? { name: slot.ma_assigned } : null,
          coordinator: getCoordinatorForRoom(`Room ${slot.room_number}`),
          room: `Room ${slot.room_number}`,
          roomPair: getRoomPair(slot.room_number),
          room_number: slot.room_number,
          startTime,
          endTime,
          status: slot.status,
          block: slot.block,
          date: slot.date,
          location: slot.location,
        }

        console.log("Transformed slot:", transformedSlot)
        return transformedSlot
      })

      console.log("Transformed clinic slots:", transformedData)
      setDebugInfo((prev) => `${prev}\nTransformed to ${transformedData.length} clinic slots`)

      // Filter by the selected date
      const selectedDateStr = format(currentDate, "yyyy-MM-dd")
      const filteredByDate = transformedData.filter((slot) => {
        const slotDateStr = slot.date
        const isMatch = slotDateStr === selectedDateStr
        console.log(`Slot date: ${slotDateStr}, Selected date: ${selectedDateStr}, Match: ${isMatch}`)
        return isMatch
      })

      console.log("Filtered by date:", filteredByDate)
      setDebugInfo((prev) => `${prev}\nFiltered to ${filteredByDate.length} slots for selected date(s)`)

      // Sort by room number
      const sortedByRoom = filteredByDate.sort((a, b) => a.room_number - b.room_number)

      console.log("Sorted by room:", sortedByRoom)
      setDebugInfo((prev) => `${prev}\nSorted by room number`)

      // Group by room pairs
      const groupedSlots = groupSlotsByRoomPair(sortedByRoom)

      console.log("Grouped by room pairs:", groupedSlots)
      setDebugInfo((prev) => `${prev}\nGrouped into ${groupedSlots.length} room pairs`)

      setClinicSlots(groupedSlots)
    } catch (error) {
      console.error("Error fetching clinic slots:", error)
      setDebugInfo((prev) => `${prev}\nError: ${error}`)
      toast({
        title: "Error",
        description: "Failed to load clinic slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Group clinic slots by room pairs and time blocks
  const groupSlotsByRoomPair = (slots: any[]) => {
    const grouped: Record<string, any> = {}

    slots.forEach((slot) => {
      const roomNum = slot.room_number
      const pairStart = Math.floor((roomNum - 1) / 2) * 2 + 1
      const pairEnd = pairStart + 1
      const pairKey = `Room ${pairStart}/${pairEnd}`
      const timeBlock = slot.block // AM or PM
      const dateStr = slot.date

      const groupKey = `${dateStr}-${pairKey}-${timeBlock}`

      if (!grouped[groupKey]) {
        // Create a new group with the first slot's data
        grouped[groupKey] = {
          ...slot,
          id: `group-${groupKey}`,
          roomPair: pairKey,
          originalSlots: [slot],
          isGrouped: true,
        }
      } else {
        // Add this slot to the existing group
        grouped[groupKey].originalSlots.push(slot)

        // If this slot has a provider and the group doesn't, use this slot's provider
        if (slot.provider_name !== "Open" && grouped[groupKey].provider_name === "Open") {
          grouped[groupKey].provider_name = slot.provider_name
          grouped[groupKey].provider = slot.provider
          grouped[groupKey].status = slot.status
        }

        // If this slot has an MA and the group doesn't, use this slot's MA
        if (slot.medicalAssistant && !grouped[groupKey].medicalAssistant) {
          grouped[groupKey].medicalAssistant = slot.medicalAssistant
        }
      }
    })

    return Object.values(grouped)
  }

  useEffect(() => {
    if (selectedLocation) {
      fetchClinicSlots()
    }
  }, [selectedLocation, currentDate])

  // Helper function to get provider title
  const getProviderTitle = (providerName: string) => {
    // First check if the provider is in our predefined list
    const provider = providers.find((p) => p.name === providerName)
    if (provider) {
      return provider.title
    }

    // If not found, return a generic title based on the provider name
    return "Provider"
  }

  // Helper function to get coordinator for a room
  const getCoordinatorForRoom = (room: string) => {
    // Simple mapping logic - in a real app, this would come from the database
    const roomNumber = Number.parseInt(room.replace("Room ", ""))
    const coordinatorIndex = roomNumber % coordinators.length
    return coordinators[coordinatorIndex]
  }

  // Helper function to group rooms into pairs
  const getRoomPair = (roomNumber: number) => {
    // Calculate the pair based on the room number
    const pairStart = Math.floor((roomNumber - 1) / 2) * 2 + 1
    const pairEnd = pairStart + 1
    return `Room ${pairStart}/${pairEnd}`
  }

  // Helper function to convert block to start time
  const getStartTimeFromBlock = (dateStr: string, block: string) => {
    // Parse the date string to ensure we have a valid date
    const date = parseISO(dateStr)
    if (block === "AM") {
      return new Date(date).setHours(8, 0, 0, 0)
    } else {
      return new Date(date).setHours(12, 30, 0, 0) // Changed from 1:00 PM to 12:30 PM
    }
  }

  // Helper function to convert block to end time
  const getEndTimeFromBlock = (dateStr: string, block: string) => {
    // Parse the date string to ensure we have a valid date
    const date = parseISO(dateStr)
    if (block === "AM") {
      return new Date(date).setHours(12, 0, 0, 0)
    } else {
      return new Date(date).setHours(17, 0, 0, 0)
    }
  }

  // Navigate to previous day
  const goToPrevious = () => {
    setCurrentDate((prevDate) => addDays(prevDate, -1))
  }

  // Navigate to next day
  const goToNext = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1))
  }

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
      setCalendarOpen(false)
    }
  }

  // Filter clinic schedule if showAvailableOnly is true
  const filteredClinicSchedule = clinicSlots.filter((session) => {
    // Filter by availability if showAvailableOnly is true
    if (showAvailableOnly) {
      return session.status === "Available" || session.provider_name === "Open"
    }

    // Filter by provider if a provider is selected
    if (selectedProviderFilter) {
      return session.provider_name === selectedProviderFilter
    }

    return true
  })

  // Handle requesting a clinic slot
  const handleRequestSlot = (slot: any) => {
    setSelectedSlot(slot)
    setSelectedProvider("1") // Default to first provider
    setRequestNotes("")
    setRequestDialogOpen(true)
  }

  // Handle releasing a clinic slot
  const handleReleaseSlot = (slot: any) => {
    setSelectedSlot(slot)
    setReleaseReason("")
    setReleaseDialogOpen(true)
  }

  // Submit request for clinic slot
  const submitRequestSlot = async () => {
    try {
      setActionLoading(true)

      if (!selectedSlot || !selectedProvider) {
        throw new Error("Missing required information")
      }

      await requestClinicSlot(selectedSlot.id, Number.parseInt(selectedProvider), requestNotes)

      toast({
        title: "Success",
        description: "Clinic slot requested successfully.",
      })

      setRequestDialogOpen(false)
      fetchClinicSlots() // Refresh data
    } catch (error) {
      console.error("Error requesting clinic slot:", error)
      toast({
        title: "Error",
        description: "Failed to request clinic slot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Submit release for clinic slot
  const submitReleaseSlot = async () => {
    try {
      setActionLoading(true)

      if (!selectedSlot) {
        throw new Error("Missing required information")
      }

      await releaseClinicSlot(selectedSlot.id, releaseReason)

      toast({
        title: "Success",
        description: "Clinic slot released successfully.",
      })

      setReleaseDialogOpen(false)
      fetchClinicSlots() // Refresh data
    } catch (error) {
      console.error("Error releasing clinic slot:", error)
      toast({
        title: "Error",
        description: "Failed to release clinic slot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Manual refresh button handler
  const handleManualRefresh = () => {
    fetchClinicSlots()
  }

  // Add a function to handle the export
  const handleExportCSV = () => {
    const formattedData = formatClinicSlotsForExport(
      selectedProviderFilter
        ? clinicSlots.filter((slot) => slot.provider_name === selectedProviderFilter)
        : clinicSlots,
    )
    const filename = `provider-schedule-${selectedLocation}-${format(currentDate, "yyyy-MM-dd")}.csv`
    exportToCSV(formattedData, filename)
  }

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Provider Schedule</h1>
          <div className="text-muted-foreground">View and manage clinic schedules and room assignments</div>
        </div>

        {/* Update the buttons in the header section to include an Export button */}
        <div className="mt-4 sm:mt-0 flex gap-2 flex-wrap">
          <Button 
            variant={showBlockSchedule ? "default" : "outline"} 
            size="sm" 
            onClick={() => setShowBlockSchedule(!showBlockSchedule)}
            className={showBlockSchedule ? "" : "bg-transparent"}
          >
            {showBlockSchedule ? <List className="mr-2 h-4 w-4" /> : <Grid3X3 className="mr-2 h-4 w-4" />}
            {showBlockSchedule ? "Daily View" : "Block Schedule"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPrintView(true)} className="bg-transparent">
            <Printer className="mr-2 h-4 w-4" />
            Print View
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleManualRefresh} className="bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowRoomAvailability(!showRoomAvailability)} className="bg-transparent">
            <DoorOpen className="mr-2 h-4 w-4" />
            {showRoomAvailability ? "Hide Room Calendar" : "View Room Calendar"}
          </Button>
        </div>
      </div>

      {/* Date Navigation with Calendar Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center justify-between border p-2 rounded-md bg-muted/30 flex-1">
          <Button variant="outline" size="icon" onClick={goToPrevious} className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent">
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
                  <span className="text-base sm:text-xl font-medium">{format(currentDate, "EEE, MMM d, yyyy")}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar mode="single" selected={currentDate} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" onClick={goToNext} className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Location Filter and Available Slots Filter */}
      <div className="mb-6 space-y-4">
        <LocationFilter
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <ProviderFilter
            providers={getProviders()}
            selectedProvider={selectedProviderFilter}
            onProviderChange={setSelectedProviderFilter}
          />

          <div className="flex items-center space-x-2">
            <Switch id="available-only" checked={showAvailableOnly} onCheckedChange={setShowAvailableOnly} />
            <Label htmlFor="available-only" className="flex items-center cursor-pointer">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              Show available slots only
            </Label>
          </div>
        </div>
      </div>

      {/* Room Availability Calendar */}
      {showRoomAvailability && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Room Availability - {selectedLocation}</CardTitle>
            </CardHeader>
            <CardContent>
              <RoomAvailabilityCalendar
                location={selectedLocation}
                date={currentDate}
                rooms={roomsByLocation[selectedLocation as keyof typeof roomsByLocation] || []}
                schedule={clinicSlots}
                onRequestSlot={handleRequestSlot}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
            <div className="mt-2">
              <p className="text-xs">Clinic Slots Count: {clinicSlots.length}</p>
              <p className="text-xs">Filtered Schedule Count: {filteredClinicSchedule.length}</p>
              <p className="text-xs">Selected Date: {format(currentDate, "yyyy-MM-dd")}</p>
              <p className="text-xs">Selected Location: {selectedLocation}</p>

              {/* Add raw data inspection */}
              <details className="mt-2">
                <summary className="text-xs font-medium cursor-pointer">Raw Data Sample (first 3 items)</summary>
                <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
                  {JSON.stringify(rawData.slice(0, 3), null, 2)}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Block Schedule View or Clinic Schedule */}
      {showBlockSchedule ? (
        <BlockScheduleView location={selectedLocation as Location} />
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading provider schedules...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {clinicSlots.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/10">
              No clinic sessions found for the selected date and location.
              <div className="mt-2">
                <Button onClick={fetchClinicSlots}>Refresh Data</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClinicSchedule.map((session) => (
                <ClinicSessionCard
                  key={session.id}
                  session={session}
                  onRequest={handleRequestSlot}
                  onRelease={handleReleaseSlot}
                />
              ))}

              {filteredClinicSchedule.length === 0 && (
                <div className="col-span-full text-center p-8 border rounded-md bg-muted/10">
                  No {showAvailableOnly ? "available" : ""} clinic sessions scheduled for this date.
                </div>
              )}
            </div>
          )}

          {/* Show message when no available slots are found */}
          {showAvailableOnly && filteredClinicSchedule.length === 0 && (
            <div className="text-center p-8 border rounded-md bg-muted/10">
              No available clinic slots found for the selected date.
            </div>
          )}
        </div>
      )}

      {/* Request Clinic Slot Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Clinic Slot</DialogTitle>
            <DialogDescription>Request this available clinic slot for your schedule.</DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="room">Room</Label>
                  <div className="font-medium mt-1">{selectedSlot.room}</div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="font-medium mt-1">{format(new Date(selectedSlot.startTime), "MMMM d, yyyy")}</div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="font-medium mt-1">
                    {format(new Date(selectedSlot.startTime), "h:mm a")} -{" "}
                    {format(new Date(selectedSlot.endTime), "h:mm a")}
                  </div>
                </div>

                <div className="col-span-4">
                  <Label htmlFor="provider">Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special requirements or notes"
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button onClick={submitRequestSlot} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Request Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Clinic Slot Dialog */}
      <Dialog open={releaseDialogOpen} onOpenChange={setReleaseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Release Clinic Slot</DialogTitle>
            <DialogDescription>Are you sure you want to release this clinic slot?</DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4">
                  <Label htmlFor="provider">Provider</Label>
                  <div className="font-medium mt-1">{selectedSlot.provider?.name}</div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="room">Room</Label>
                  <div className="font-medium mt-1">{selectedSlot.room}</div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="font-medium mt-1">{format(new Date(selectedSlot.startTime), "MMMM d, yyyy")}</div>
                </div>

                <div className="col-span-4">
                  <Label htmlFor="time">Time</Label>
                  <div className="font-medium mt-1">
                    {format(new Date(selectedSlot.startTime), "h:mm a")} -{" "}
                    {format(new Date(selectedSlot.endTime), "h:mm a")}
                  </div>
                </div>

                <div className="col-span-4">
                  <Label htmlFor="reason">Reason for release</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for releasing this slot"
                    value={releaseReason}
                    onChange={(e) => setReleaseReason(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReleaseDialogOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitReleaseSlot} disabled={actionLoading}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Release Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showPrintView && (
        <PrintSchedule
          date={currentDate}
          location={selectedLocation}
          clinicSlots={clinicSlots}
          onClose={() => setShowPrintView(false)}
          selectedProvider={selectedProviderFilter}
        />
      )}
    </div>
  )
}

// Component for a single clinic session card
function ClinicSessionCard({
  session,
  onRequest,
  onRelease,
}: {
  session: any
  onRequest: (session: any) => void
  onRelease: (session: any) => void
}) {
  const isAvailable = session.status === "Available" || session.provider_name === "Open"

  // Use roomPair if available, otherwise use room
  const roomDisplay = session.roomPair || session.room

  // For grouped slots, we might have multiple providers
  const providerDisplay = (() => {
    if (session.isGrouped && session.originalSlots) {
      // Get unique provider names, excluding "Open"
      const uniqueProviders = [
        ...new Set(
          session.originalSlots.filter((s: any) => s.provider_name !== "Open").map((s: any) => s.provider_name),
        ),
      ]

      return uniqueProviders.length > 0 ? uniqueProviders.join(", ") : "Open"
    }

    return isAvailable ? "Open" : session.provider?.name || session.provider_name
  })()

  return (
    <Card className={cn(isAvailable ? "border-dashed border-muted-foreground/50" : "")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-lg">{providerDisplay}</div>
            <div className="text-sm text-muted-foreground">{session.provider?.title || "Provider"}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={isAvailable ? "outline" : "default"}>{session.status}</Badge>
            <span className="text-xs text-muted-foreground">{session.block} Block</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
          <div className="flex items-center">
            <DoorOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{roomDisplay}</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {format(new Date(session.startTime), "h:mm a")} - {format(new Date(session.endTime), "h:mm a")}
            </span>
          </div>

          {!isAvailable && (
            <>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>MA: {session.medicalAssistant?.name || "Unassigned"}</span>
              </div>

              <div className="flex items-center">
                <CalendarPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Coord: {session.coordinator?.name || "Unassigned"}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {isAvailable ? (
          <Button className="w-full" size="sm" onClick={() => onRequest(session)}>
            <Plus className="h-4 w-4 mr-2" />
            Request Slot
          </Button>
        ) : (
          <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={() => onRelease(session)}>
            <X className="h-4 w-4 mr-2" />
            Release Slot
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Block Schedule View Component
function BlockScheduleView({ location }: { location: Location }) {
  const rooms = ROOM_CONFIGS[location] || []
  
  // Get entries for this location
  const locationEntries = BLOCK_SCHEDULE.entries.filter(
    (entry) => entry.location === location
  )

  // Helper to get provider for a specific room, day, and block
  const getProvider = (room: string, day: string, block: "AM" | "PM") => {
    const entry = locationEntries.find(
      (e) => e.dayOfWeek === day && e.block === block
    )
    return entry?.rooms[room] || ""
  }

  // Helper to get cell styling based on provider
  const getCellStyle = (provider: string) => {
    if (provider === "Open") {
      return "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-dashed"
    }
    if (provider === "N/A") {
      return "bg-muted/50 text-muted-foreground"
    }
    return "bg-background"
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No rooms configured for {location}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Week 1 Block Schedule - {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] font-semibold">Room</TableHead>
                {DAYS_OF_WEEK.map((day) => (
                  <TableHead key={day} className="text-center min-w-[140px]" colSpan={2}>
                    {day}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead />
                {DAYS_OF_WEEK.map((day) => (
                  <React.Fragment key={`${day}-header`}>
                    <TableHead className="text-center text-xs font-medium text-muted-foreground">
                      AM
                    </TableHead>
                    <TableHead className="text-center text-xs font-medium text-muted-foreground">
                      PM
                    </TableHead>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room}>
                  <TableCell className="font-medium text-sm whitespace-nowrap">
                    {room}
                  </TableCell>
                  {DAYS_OF_WEEK.map((day) => (
                    <React.Fragment key={`${room}-${day}`}>
                      <TableCell
                        className={cn(
                          "text-center text-sm border-l p-2",
                          getCellStyle(getProvider(room, day, "AM"))
                        )}
                      >
                        {getProvider(room, day, "AM") || "-"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-center text-sm p-2",
                          getCellStyle(getProvider(room, day, "PM"))
                        )}
                      >
                        {getProvider(room, day, "PM") || "-"}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 dark:bg-green-950/30 border border-dashed border-green-300 rounded" />
            <span className="text-muted-foreground">Open - Available for booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted/50 border rounded" />
            <span className="text-muted-foreground">N/A - Not available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
