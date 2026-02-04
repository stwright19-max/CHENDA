/**
 * Exports data to a CSV file and triggers a download
 */
export function exportToCSV(data: any[], filename: string) {
  // Get all unique keys from the data
  const allKeys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key))
  })

  // Filter out keys we don't want to include
  const excludedKeys = ["id", "created_at", "updated_at", "source_block_schedule_id"]
  const keys = Array.from(allKeys).filter((key) => !excludedKeys.includes(key))

  // Create CSV header row
  const header = keys.join(",")

  // Create CSV rows
  const rows = data.map((item) => {
    return keys
      .map((key) => {
        const value = item[key]
        // Handle special cases
        if (value === null || value === undefined) return ""
        if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`
        return value
      })
      .join(",")
  })

  // Combine header and rows
  const csv = [header, ...rows].join("\n")

  // Create a blob and download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Formats clinic slots data for export
 */
export function formatClinicSlotsForExport(clinicSlots: any[]) {
  return clinicSlots.map((slot) => {
    // If this is a grouped slot, use the roomPair
    const room = slot.roomPair || slot.room

    // Format the slot data for export
    return {
      date: slot.date,
      block: slot.block,
      time: `${slot.block === "AM" ? "8:00 AM - 12:00 PM" : "12:30 PM - 5:00 PM"}`,
      location: slot.location,
      room: room,
      room_number: slot.isGrouped
        ? `${slot.originalSlots.map((s: any) => s.room_number).join(", ")}`
        : slot.room_number,
      provider: slot.provider_name === "Open" ? "Open" : slot.provider_name,
      status: slot.status,
      ma_assigned: slot.ma_assigned || "Unassigned",
      notes: slot.notes || "",
    }
  })
}
