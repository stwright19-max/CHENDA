"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProviderFilterV2 } from "./provider-filter-v2"
import { PrintScheduleV2 } from "./print-schedule-v2"
import { exportToCSV, formatClinicSlotsForExport } from "@/lib/export-utils-v2"
import { getProviders } from "@/lib/data-service"

interface IntegrationExampleProps {
  clinicSlots: any[]
  date: Date
  location: string
  className?: string
}

export function IntegrationExample({ clinicSlots, date, location, className }: IntegrationExampleProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [showPrintView, setShowPrintView] = useState(false)

  // Get providers for the filter
  const providers = getProviders()

  // Filter clinic slots by provider if selected
  const filteredSlots = selectedProvider
    ? clinicSlots.filter((slot) => slot.provider_name === selectedProvider)
    : clinicSlots

  // Handle export to CSV
  const handleExportCSV = () => {
    const formattedData = formatClinicSlotsForExport(filteredSlots)
    const filename = `provider-schedule-${location}-${format(date, "yyyy-MM-dd")}.csv`

    // Custom headers mapping for better column names
    const customHeaders = {
      date: "Date",
      block: "Session",
      time: "Time",
      location: "Location",
      room: "Room",
      room_number: "Room Number",
      provider: "Provider",
      status: "Status",
      ma_assigned: "Medical Assistant",
      notes: "Notes",
    }

    exportToCSV(formattedData, filename, customHeaders)
  }

  return (
    <div className={className}>
      {/* Provider Filter and Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <ProviderFilterV2
          providers={providers}
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          className="w-full sm:w-auto"
        />

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setShowPrintView(true)} className="flex-1 sm:flex-initial">
            <Printer className="mr-2 h-4 w-4" />
            Print View
          </Button>

          <Button variant="outline" onClick={handleExportCSV} className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Display filtered slots here using your V20 design */}
      <div className="border rounded-md p-4">
        <h2 className="text-lg font-medium mb-4">
          {selectedProvider ? `Schedule for ${selectedProvider}` : "All Providers Schedule"}
        </h2>

        {/* Your V20 design for displaying clinic slots would go here */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredSlots.length} slots for {location} on {format(date, "MMMM d, yyyy")}
        </p>
      </div>

      {/* Print View */}
      {showPrintView && (
        <PrintScheduleV2
          date={date}
          location={location}
          clinicSlots={clinicSlots}
          onClose={() => setShowPrintView(false)}
          selectedProvider={selectedProvider}
          // You can customize the appearance with these props
          // headerClassName="bg-gray-100 p-4 rounded-t-md"
          // tableClassName="bg-white"
          // buttonClassName="bg-blue-600 hover:bg-blue-700"
        />
      )}
    </div>
  )
}
