"use client"

import { format } from "date-fns"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, X } from "lucide-react"

interface PrintScheduleProps {
  date: Date
  location: string
  clinicSlots: any[]
  onClose: () => void
  selectedProvider: string | null
  className?: string
  headerClassName?: string
  tableClassName?: string
  buttonClassName?: string
  title?: string
}

export function PrintScheduleV2({
  date,
  location,
  clinicSlots,
  onClose,
  selectedProvider,
  className,
  headerClassName,
  tableClassName,
  buttonClassName,
  title = "Provider Schedule",
}: PrintScheduleProps) {
  const printRef = useRef<HTMLDivElement>(null)

  // Filter slots by provider if selected
  const filteredSlots = selectedProvider
    ? clinicSlots.filter((slot) => slot.provider_name === selectedProvider)
    : clinicSlots

  // Group slots by AM/PM blocks
  const amSlots = filteredSlots.filter((slot) => slot.block === "AM")
  const pmSlots = filteredSlots.filter((slot) => slot.block === "PM")

  // Sort slots by room number
  const sortByRoom = (a: any, b: any) => a.room_number - b.room_number

  const sortedAmSlots = [...amSlots].sort(sortByRoom)
  const sortedPmSlots = [...pmSlots].sort(sortByRoom)

  // Add this function before the return statement
  const groupAndSortSlots = (slots: any[]) => {
    // First sort by room number
    const sorted = [...slots].sort((a, b) => a.room_number - b.room_number)

    // Group by room pairs
    const grouped: Record<string, any[]> = {}

    sorted.forEach((slot) => {
      const roomNum = slot.room_number
      const pairStart = Math.floor((roomNum - 1) / 2) * 2 + 1
      const pairEnd = pairStart + 1
      const pairKey = `Room ${pairStart}/${pairEnd}`

      if (!grouped[pairKey]) {
        grouped[pairKey] = []
      }
      grouped[pairKey].push(slot)
    })

    // Convert back to array with pair information
    return Object.entries(grouped).map(([pairKey, slots]) => ({
      roomPair: pairKey,
      slots,
    }))
  }

  // Group and sort the AM and PM slots
  const groupedAmSlots = groupAndSortSlots(sortedAmSlots)
  const groupedPmSlots = groupAndSortSlots(sortedPmSlots)

  // Handle print action
  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const originalContents = document.body.innerHTML
    const printContents = printContent.innerHTML

    document.body.innerHTML = `
      <div class="print-container">
        ${printContents}
      </div>
    `

    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  // Add print styles when component mounts
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "print-styles"
    style.innerHTML = `
      @media print {
        body {
          font-size: 12pt;
          color: black;
          background-color: white;
        }
        .print-container {
          width: 100%;
          padding: 0;
          margin: 0;
        }
        .no-print {
          display: none !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        h1, h2, h3 {
          margin-top: 12pt;
          margin-bottom: 6pt;
        }
        @page {
          size: portrait;
          margin: 0.5in;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      const styleElement = document.getElementById("print-styles")
      if (styleElement) {
        document.head.removeChild(styleElement)
      }
    }
  }, [])

  return (
    <div className={cn("fixed inset-0 bg-white z-50 overflow-auto p-8", className)}>
      <div className="max-w-5xl mx-auto">
        <div className={cn("flex justify-between items-center mb-6 no-print", headerClassName)}>
          <h2 className="text-2xl font-bold">Print Preview</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className={cn("bg-green-600 hover:bg-green-700", buttonClassName)}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </div>

        <div ref={printRef}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-lg">
              {location} - {format(date, "EEEE, MMMM d, yyyy")}
            </p>
            {selectedProvider && <p className="text-lg font-medium">Provider: {selectedProvider}</p>}
          </div>

          {/* Morning Schedule */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 border-b pb-2">Morning Schedule (8:00 AM - 12:00 PM)</h2>
            {groupedAmSlots.length > 0 ? (
              <table className={cn("w-full border-collapse", tableClassName)}>
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Room</th>
                    <th className="border p-2 text-left">Provider</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">MA</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedAmSlots.map((group, index) => (
                    <tr key={index}>
                      <td className="border p-2">{group.roomPair}</td>
                      <td className="border p-2">
                        {group.slots
                          .map((slot) => (slot.provider_name === "Open" ? "Open" : slot.provider_name))
                          .join(", ")}
                      </td>
                      <td className="border p-2">{group.slots.map((slot) => slot.status).join(", ")}</td>
                      <td className="border p-2">
                        {group.slots.map((slot) => slot.ma_assigned || "Unassigned").join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4 italic">No morning sessions scheduled.</p>
            )}
          </div>

          {/* Afternoon Schedule */}
          <div>
            <h2 className="text-xl font-bold mb-3 border-b pb-2">Afternoon Schedule (12:30 PM - 5:00 PM)</h2>
            {groupedPmSlots.length > 0 ? (
              <table className={cn("w-full border-collapse", tableClassName)}>
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Room</th>
                    <th className="border p-2 text-left">Provider</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">MA</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPmSlots.map((group, index) => (
                    <tr key={index}>
                      <td className="border p-2">{group.roomPair}</td>
                      <td className="border p-2">
                        {group.slots
                          .map((slot) => (slot.provider_name === "Open" ? "Open" : slot.provider_name))
                          .join(", ")}
                      </td>
                      <td className="border p-2">{group.slots.map((slot) => slot.status).join(", ")}</td>
                      <td className="border p-2">
                        {group.slots.map((slot) => slot.ma_assigned || "Unassigned").join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4 italic">No afternoon sessions scheduled.</p>
            )}
          </div>

          {/* Footer with timestamp */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
