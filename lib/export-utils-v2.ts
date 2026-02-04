/**
 * Exports data to a CSV file and triggers a download
 * @param data Array of objects to export
 * @param filename Name of the CSV file
 * @param customHeaders Optional custom headers mapping
 */
export function exportToCSV(data: any[], filename: string, customHeaders?: Record<string, string>) {
  if (data.length === 0) {
    console.warn("No data to export")
    return
  }

  // Get all unique keys from the data
  const allKeys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key))
  })

  // Filter out keys we don't want to include
  const excludedKeys = ["id", "created_at", "updated_at", "source_block_schedule_id"]
  const keys = Array.from(allKeys).filter((key) => !excludedKeys.includes(key))

  // Create CSV header row with optional custom headers
  const headerRow = keys.map((key) => customHeaders?.[key] || key).join(",")

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
  const csv = [headerRow, ...rows].join("\n")

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
 * Formats clinic slots data for export with customizable field mapping
 * @param clinicSlots Array of clinic slots to format
 * @param fieldMapping Optional custom field mapping
 */
export function formatClinicSlotsForExport(clinicSlots: any[], fieldMapping?: Record<string, (slot: any) => any>) {
  return clinicSlots.map((slot) => {
    // Default formatting
    const formatted = {
      date: slot.date,
      block: slot.block,
      time: `${slot.block === "AM" ? "9:00 AM - 12:00 PM" : "1:00 PM - 5:00 PM"}`,
      location: slot.location,
      room: slot.room,
      room_number: slot.room_number,
      provider: slot.provider_name === "Open" ? "Available" : slot.provider_name,
      status: slot.status,
      ma_assigned: slot.ma_assigned || "Unassigned",
      notes: slot.notes || "",
    }

    // Apply custom field mapping if provided
    if (fieldMapping) {
      Object.entries(fieldMapping).forEach(([key, mapFn]) => {
        formatted[key] = mapFn(slot)
      })
    }

    return formatted
  })
}
