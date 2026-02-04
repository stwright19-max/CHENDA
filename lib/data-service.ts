import { createClient } from "@/lib/supabase"

// Interface for clinic slots
export interface ClinicSlot {
  id: string
  provider_name: string
  date: string
  block: string
  location: string
  room_number: number
  status: string
  ma_assigned: string | null
  notes: string | null
  created_at: string
  updated_at: string
  source_block_schedule_id: string
}

// Add this interface for MA assignments
export interface MAAssignment {
  id: string
  ma_name: string
  provider_name: string
  location: string
  date: string
  block: string // AM or PM instead of shift
  assignment_type: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Add this interface for Employee
export interface Employee {
  id: number
  name: string
  email: string | null
  department: string
  role: string
  location: string | null
  days_off: string[] | null
  start_date: string | null
  end_date: string | null
  is_active: boolean
  notes: string | null
  created_at?: string
  updated_at?: string
}

// Get clinic slots with filtering
export async function getClinicSlots(
  filters: {
    location?: string
    date?: string
    block?: string
    status?: string
  } = {},
) {
  try {
    const supabase = createClient()

    let query = supabase.from("generated_clinic_slots").select("*")

    // Apply filters
    if (filters.location) {
      query = query.eq("location", filters.location)
    }

    if (filters.date) {
      query = query.eq("date", filters.date)
    }

    if (filters.block) {
      query = query.eq("block", filters.block)
    }

    if (filters.status) {
      query = query.eq("status", filters.status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching clinic slots:", error)
      throw new Error("Failed to fetch clinic slots")
    }

    console.log(`Fetched ${data?.length || 0} clinic slots`)

    // If we have slots and date/location filters, update with MA assignments
    if (data && data.length > 0 && filters.date && filters.location) {
      console.log(`Updating clinic slots with MA assignments for ${filters.date}, ${filters.location}`)

      // Get MA assignments and update slots
      const updatedSlots = await updateClinicSlotsWithMAAssignments(data, filters.date, filters.location)
      return updatedSlots
    }

    return data || []
  } catch (error) {
    console.error("Error fetching clinic slots:", error)

    // Return sample data for testing if no data is available
    console.log("Returning sample data for testing")
    return generateSampleClinicSlots()
  }
}

// Generate sample clinic slots for testing
function generateSampleClinicSlots() {
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  return [
    {
      id: "1",
      provider_name: "Jon Shaker",
      date: todayStr,
      block: "AM",
      location: "Waltham",
      room_number: 101,
      status: "Scheduled",
      ma_assigned: "Emily Rodriguez",
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_block_schedule_id: "abc123",
    },
    {
      id: "2",
      provider_name: "Dr. Sarah Johnson",
      date: todayStr,
      block: "PM",
      location: "Waltham",
      room_number: 102,
      status: "Scheduled",
      ma_assigned: "David Kim",
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_block_schedule_id: "def456",
    },
    {
      id: "3",
      provider_name: "Open",
      date: todayStr,
      block: "AM",
      location: "Waltham",
      room_number: 103,
      status: "Available",
      ma_assigned: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_block_schedule_id: "ghi789",
    },
  ]
}

// Get unique locations
export async function getLocations() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("generated_clinic_slots").select("location")

    if (error) {
      console.error("Error fetching locations:", error)
      throw new Error("Failed to fetch locations")
    }

    // Extract unique locations
    const locations = [...new Set(data.map((item) => item.location).filter(Boolean))]
    console.log("Fetched locations:", locations)

    return locations.length > 0 ? locations : ["Waltham", "Dedham", "Woburn", "Westboro", "Remote"]
  } catch (error) {
    console.error("Error fetching locations:", error)
    return ["Waltham", "Dedham", "Woburn", "Westboro", "Remote"]
  }
}

// Get unique providers from the database
export async function getProvidersFromDB() {
  try {
    const supabase = createClient()

    // First try to get providers from the providers table
    const { data: providersData, error: providersError } = await supabase.from("providers").select("*").order("name")

    if (!providersError && providersData && providersData.length > 0) {
      console.log("Fetched providers from providers table:", providersData)
      return providersData
    }

    // If no providers table or no data, fall back to getting unique provider names from clinic slots
    const { data, error } = await supabase
      .from("generated_clinic_slots")
      .select("provider_name")
      .not("provider_name", "eq", "Open")

    if (error) {
      console.error("Error fetching providers:", error)
      throw new Error("Failed to fetch providers")
    }

    // Extract unique provider names
    const providerNames = [...new Set(data.map((item) => item.provider_name).filter(Boolean))]

    // Format as objects with id and name
    return providerNames.map((name, index) => ({
      id: index + 1,
      name,
      department: "Clinical",
      title: "Provider",
    }))
  } catch (error) {
    console.error("Error fetching providers:", error)
    return getProviders() // Fallback to sample data
  }
}

// Assign MA to clinic slot
export async function assignMAToClinicSlot(slotId: string, maName: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("generated_clinic_slots")
      .update({ ma_assigned: maName, updated_at: new Date().toISOString() })
      .eq("id", slotId)
      .select()

    if (error) {
      console.error("Error assigning MA to clinic slot:", error)
      throw new Error("Failed to assign MA to clinic slot")
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error assigning MA to clinic slot:", error)
    throw new Error("Failed to assign MA to clinic slot")
  }
}

// Get MAs from ma_assignments
export async function getMedicalAssistants() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("ma_assignments").select("ma_name").eq("is_active", true)

    if (error) {
      console.error("Error fetching medical assistants:", error)
      throw new Error("Failed to fetch medical assistants")
    }

    // Extract unique MA names
    const maNames = [...new Set(data.map((item) => item.ma_name))]

    // Format as objects with id and name
    return maNames.map((name, index) => ({
      id: index + 1,
      name,
      role: "Medical Assistant",
    }))
  } catch (error) {
    console.error("Error fetching medical assistants:", error)
    // Return sample data as fallback
    return [
      { id: 1, name: "Emily Rodriguez", role: "Medical Assistant" },
      { id: 2, name: "David Kim", role: "Medical Assistant" },
      { id: 3, name: "Sophia Patel", role: "Medical Assistant" },
    ]
  }
}

// Add this function to fetch MA assignments
export async function getMAAssignments(
  filters: {
    date?: string
    location?: string
    ma_name?: string
    provider_name?: string
    dateRange?: { from: string; to: string }
  } = {},
) {
  try {
    const supabase = createClient()

    let query = supabase.from("ma_assignments").select("*")

    // Apply filters
    if (filters.date) {
      query = query.eq("date", filters.date)
    } else if (filters.dateRange) {
      // Add date range support
      query = query.gte("date", filters.dateRange.from).lte("date", filters.dateRange.to)
    }

    if (filters.location) {
      query = query.eq("location", filters.location)
    }

    if (filters.ma_name) {
      query = query.eq("ma_name", filters.ma_name)
    }

    if (filters.provider_name) {
      query = query.eq("provider_name", filters.provider_name)
    }

    // Only get active assignments
    query = query.eq("is_active", true)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching MA assignments:", error)
      throw new Error(`Failed to fetch MA assignments: ${error.message}`)
    }

    console.log(`Retrieved ${data?.length || 0} MA assignments from database`)

    // If no data is found, return sample data
    if (!data || data.length === 0) {
      console.log("No MA assignments found in database, returning sample data")
      return generateSampleMAAssignments(filters)
    }

    // Consolidate AM and PM blocks for each MA on the same day and location
    const consolidatedData = consolidateMAAssignments(data)

    return consolidatedData
  } catch (error: any) {
    console.error("Error fetching MA assignments:", error)

    // Return sample data for testing if no data is available
    console.log("Error occurred, returning sample data:", error.message)
    return generateSampleMAAssignments(filters)
  }
}

// Helper function to consolidate AM and PM blocks for each MA
function consolidateMAAssignments(assignments: any[]) {
  // Group assignments by MA, date, and location
  const groupedAssignments = assignments.reduce((acc: any, assignment: any) => {
    const key = `${assignment.ma_name}-${assignment.date}-${assignment.location}`

    if (!acc[key]) {
      acc[key] = {
        ...assignment,
        blocks: [assignment.block],
        providers: [assignment.provider_name],
        // Set a standard full-day shift
        shift: "8:30 AM - 5:00 PM",
        // Set provider_name to "Float" if it's empty or null
        provider_name: assignment.provider_name || "Float",
      }
    } else {
      // Add this block and provider to the existing entry
      acc[key].blocks.push(assignment.block)
      if (assignment.provider_name) {
        acc[key].providers.push(assignment.provider_name)
      }

      // If this is a different provider, combine the provider names
      if (assignment.provider_name && !acc[key].providers.includes(assignment.provider_name)) {
        acc[key].provider_name = acc[key].providers.filter(Boolean).join(", ") || "Float"
      }
    }

    return acc
  }, {})

  // Convert the grouped object back to an array
  return Object.values(groupedAssignments)
}

// Update the sample data generator to include "Float" as the default assignment
function generateSampleMAAssignments(filters: any = {}) {
  const today = new Date()
  const dateStr = filters.date || today.toISOString().split("T")[0]

  const allSamples = [
    {
      id: "1",
      ma_name: "Emily Rodriguez",
      provider_name: "Dr. Drew",
      location: "Waltham",
      date: dateStr,
      block: "AM",
      assignment_type: "Provider",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shift: "8:30 AM - 5:00 PM",
    },
    {
      id: "2",
      ma_name: "David Kim",
      provider_name: "Dr. Hofmann",
      location: "Dedham",
      date: dateStr,
      block: "AM",
      assignment_type: "Provider",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shift: "8:30 AM - 5:00 PM",
    },
    {
      id: "3",
      ma_name: "Sophia Patel",
      provider_name: "Lauren Dolloff",
      location: "Woburn",
      date: dateStr,
      block: "AM",
      assignment_type: "Provider",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shift: "8:30 AM - 5:00 PM",
    },
    {
      id: "4",
      ma_name: "Emily Rodriguez",
      provider_name: "Tom Pacheco",
      location: "Westboro",
      date: dateStr,
      block: "PM",
      assignment_type: "Provider",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shift: "8:30 AM - 5:00 PM",
    },
    {
      id: "5",
      ma_name: "David Kim",
      provider_name: "Sheri Martinelli",
      location: "Waltham",
      date: dateStr,
      block: "PM",
      assignment_type: "Provider",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shift: "8:30 AM - 5:00 PM",
    },
    // Add a Float MA
    {
      id: "6",
      ma_name: "Jason Rand",
      provider_name: "", // Empty provider name
      location: "Waltham",
      date: dateStr,
      block: "AM",
      assignment_type: "Float",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      shift: "8:30 AM - 5:00 PM",
    },
  ]

  // Apply filters to sample data
  return allSamples.filter((sample) => {
    if (filters.location && sample.location !== filters.location) return false
    if (filters.ma_name && sample.ma_name !== filters.ma_name) return false
    if (filters.provider_name && sample.provider_name !== filters.provider_name) return false
    return true
  })
}

// Add this function to update clinic slots with MA assignments
export async function updateClinicSlotsWithMAAssignments(slots: ClinicSlot[], date: string, location: string) {
  try {
    // Get raw assignments (not consolidated) to properly match by block
    const supabase = createClient()
    const query = supabase
      .from("ma_assignments")
      .select("*")
      .eq("date", date)
      .eq("location", location)
      .eq("is_active", true)

    const { data: assignments, error } = await query

    if (error) {
      console.error("Error fetching MA assignments:", error)
      return slots
    }

    console.log(`Retrieved ${assignments?.length || 0} raw MA assignments for clinic slots`)

    if (!assignments || assignments.length === 0) {
      return slots
    }

    // Create a lookup map for faster matching
    const assignmentMap = new Map()

    assignments.forEach((assignment) => {
      // Use provider_name and block as the key
      const key = `${assignment.provider_name}-${assignment.block}`
      assignmentMap.set(key, assignment.ma_name)

      // Log for debugging
      console.log(`Assignment map entry: ${key} -> ${assignment.ma_name}`)
    })

    // Update slots with MA assignments
    const updatedSlots = slots.map((slot) => {
      // Skip "Open" slots
      if (slot.provider_name === "Open") {
        return slot
      }

      const key = `${slot.provider_name}-${slot.block}`
      console.log(`Looking for assignment with key: ${key}`)

      const maName = assignmentMap.get(key)

      if (maName) {
        console.log(`Found MA assignment for ${slot.provider_name} (${slot.block}): ${maName}`)
        return {
          ...slot,
          ma_assigned: maName,
        }
      }

      return slot
    })

    return updatedSlots
  } catch (error) {
    console.error("Error updating clinic slots with MA assignments:", error)
    return slots
  }
}

// Get coordinators (sample data for now)
export function getCoordinators() {
  return [
    { id: 1, name: "Jason Rand", role: "Coordinator" },
    { id: 2, name: "Stephen Wright", role: "Coordinator" },
    { id: 3, name: "Olivia Martinez", role: "Coordinator" },
  ]
}

// Get providers (sample data for now)
export function getProviders() {
  return [
    { id: 1, name: "Dr. Drew", department: "Provider", title: "Physician Assistant" },
    { id: 2, name: "Dr. Hofmann", department: "Provider", title: "Primary Care Physician" },
    { id: 3, name: "Lauren Dolloff", department: "Provider", title: "Physician Assistant" },
    { id: 4, name: "Tom Pacheco", department: "Provider", title: "Physician Assistant" },
    { id: 5, name: "Sheri Martinelli", department: "Provider", title: "Physician Assistant" },
    { id: 6, name: "Dr. Kim", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 7, name: "Dr. McKeon", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 8, name: "Christina Ramirez", department: "Provider", title: "Physician Assistant" },
    { id: 9, name: "Matt Attolino", department: "Provider", title: "Physician Assistant" },
    { id: 10, name: "Jason Rand", department: "Provider", title: "Physician Assistant" },
    { id: 11, name: "Dr. Miller", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 12, name: "Dr. Wuerz", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 13, name: "Dr. Mithoefer", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 14, name: "Dr. Braziel", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 15, name: "Alex Wolfe", department: "Provider", title: "Physician Assistant" },
    { id: 16, name: "Stephen Wright", department: "Provider", title: "Physician Assistant" },
    { id: 17, name: "Dr. Weitzel", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 18, name: "Julie Winn", department: "Provider", title: "Physician Assistant" },
    { id: 19, name: "Natalie Oswald", department: "Provider", title: "Physician Assistant" },
    { id: 20, name: "Sean Kelly", department: "Provider", title: "Physician Assistant" },
    { id: 21, name: "Dr. Kwon", department: "Provider", title: "Orthopedic Surgeon" },
    { id: 22, name: "Dan Lococo", department: "Provider", title: "Nurse Practitioner" },
  ]
}

// Get rooms by location
export function getRoomsByLocation() {
  return {
    Waltham: Array.from({ length: 22 }, (_, i) => `Room ${i + 1}`),
    Dedham: Array.from({ length: 12 }, (_, i) => `Room ${i + 1}`),
    Woburn: Array.from({ length: 10 }, (_, i) => `Room ${i + 1}`),
    Westboro: Array.from({ length: 2 }, (_, i) => `Room ${i + 1}`),
    Remote: [],
  }
}

// Request a clinic slot
export async function requestClinicSlot(slotId: string, providerId: number, notes: string) {
  try {
    const supabase = createClient()
    const providers = getProviders()
    const provider = providers.find((p) => p.id === providerId)

    if (!provider) {
      throw new Error("Provider not found")
    }

    const { data, error } = await supabase
      .from("generated_clinic_slots")
      .update({
        provider_name: provider.name,
        status: "Scheduled",
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", slotId)
      .select()

    if (error) {
      console.error("Error requesting clinic slot:", error)
      throw new Error("Failed to request clinic slot")
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error requesting clinic slot:", error)
    throw new Error("Failed to request clinic slot")
  }
}

// Release a clinic slot
export async function releaseClinicSlot(slotId: string, reason: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("generated_clinic_slots")
      .update({
        provider_name: "Open",
        status: "Available",
        notes: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", slotId)
      .select()

    if (error) {
      console.error("Error releasing clinic slot:", error)
      throw new Error("Failed to release clinic slot")
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error releasing clinic slot:", error)
    throw new Error("Failed to release clinic slot")
  }
}

// Employee Management Functions

// Get all employees
export async function getEmployees(filters: { isActive?: boolean; search?: string } = {}) {
  try {
    const supabase = createClient()

    let query = supabase.from("employees").select("*")

    // Apply filters
    if (filters.isActive !== undefined) {
      query = query.eq("is_active", filters.isActive)
    }

    // Apply search if provided
    if (filters.search) {
      const searchTerm = `%${filters.search}%`
      query = query.or(
        `name.ilike.${searchTerm},department.ilike.${searchTerm},role.ilike.${searchTerm},location.ilike.${searchTerm}`,
      )
    }

    // Order by name
    query = query.order("name")

    const { data, error } = await query

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("does not exist") || error.code === "42P01") {
        console.warn("Employees table does not exist, returning mock data")
        return getMockEmployees(filters)
      }

      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error fetching employees:", error)
    // Return mock data as fallback
    return getMockEmployees(filters)
  }
}

// Mock employees data for preview environment
function getMockEmployees(filters: { isActive?: boolean; search?: string } = {}) {
  // Base mock employees
  const baseMockEmployees = [
    {
      id: 1,
      name: "Jon Shaker",
      email: "jon.shaker@example.com",
      department: "Clinical",
      role: "Physician Assistant",
      location: "Waltham",
      days_off: ["Saturday", "Sunday"],
      start_date: "2022-01-15",
      end_date: null,
      is_active: true,
      notes: "Lead physician assistant",
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      department: "Clinical",
      role: "Primary Care Physician",
      location: "Dedham",
      days_off: ["Sunday", "Monday"],
      start_date: "2021-06-10",
      end_date: null,
      is_active: true,
      notes: null,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      department: "Clinical",
      role: "Medical Assistant",
      location: "Waltham",
      days_off: ["Saturday", "Sunday"],
      start_date: "2022-03-22",
      end_date: null,
      is_active: true,
      notes: null,
    },
    {
      id: 4,
      name: "Jason Rand",
      email: "jason.rand@example.com",
      department: "Administrative",
      role: "Office Manager",
      location: "Waltham",
      days_off: ["Sunday"],
      start_date: "2021-11-05",
      end_date: null,
      is_active: true,
      notes: "Manages Waltham office",
    },
    {
      id: 5,
      name: "Stephen Wright",
      email: "stephen.wright@example.com",
      department: "Coordinator",
      role: "Patient Coordinator",
      location: "Dedham",
      days_off: ["Saturday", "Sunday"],
      start_date: "2022-02-15",
      end_date: null,
      is_active: true,
      notes: null,
    },
    {
      id: 6,
      name: "David Kim",
      email: "david.kim@example.com",
      department: "Clinical",
      role: "Medical Assistant",
      location: "Woburn",
      days_off: ["Sunday"],
      start_date: "2022-05-10",
      end_date: null,
      is_active: true,
      notes: null,
    },
    {
      id: 7,
      name: "Lauren Dolloff",
      email: "lauren.dolloff@example.com",
      department: "Provider",
      role: "Physician Assistant",
      location: "Westboro",
      days_off: ["Friday", "Saturday"],
      start_date: "2021-09-15",
      end_date: null,
      is_active: true,
      notes: null,
    },
    {
      id: 8,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      department: "Clinical",
      role: "Cardiologist",
      location: "Woburn",
      days_off: ["Thursday", "Friday"],
      start_date: "2020-11-20",
      end_date: "2023-06-30",
      is_active: false,
      notes: "Left for private practice",
    },
  ]

  // Try to get additional employees from localStorage (for preview environment)
  let allEmployees = [...baseMockEmployees]

  if (typeof window !== "undefined") {
    try {
      const storedEmployees = localStorage.getItem("mockEmployees")
      if (storedEmployees) {
        const parsedEmployees = JSON.parse(storedEmployees)
        // Combine with base employees, avoiding duplicates by ID
        const existingIds = new Set(baseMockEmployees.map((e) => e.id))
        const newEmployees = parsedEmployees.filter((e: any) => !existingIds.has(e.id))
        allEmployees = [...baseMockEmployees, ...newEmployees]
      }
    } catch (e) {
      console.warn("Failed to load employees from localStorage:", e)
    }
  }

  // Apply filters
  let filteredEmployees = [...allEmployees]

  if (filters.isActive !== undefined) {
    filteredEmployees = filteredEmployees.filter((emp) => emp.is_active === filters.isActive)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredEmployees = filteredEmployees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.role.toLowerCase().includes(searchLower) ||
        (emp.location && emp.location.toLowerCase().includes(searchLower)),
    )
  }

  return filteredEmployees
}

// Get employee by ID
export async function getEmployeeById(id: number) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("does not exist") || error.code === "42P01") {
        console.warn("Employees table does not exist, returning mock data")
        return getMockEmployeeById(id)
      }

      throw error
    }

    return data
  } catch (error) {
    console.error("Error fetching employee:", error)
    // Return mock data as fallback
    return getMockEmployeeById(id)
  }
}

// Get mock employee by ID
function getMockEmployeeById(id: number) {
  const mockEmployees = getMockEmployees()
  return mockEmployees.find((emp) => emp.id === id) || null
}

// Create a new employee
export async function createEmployee(employee: Omit<Employee, "id" | "created_at" | "updated_at">) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          ...employee,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return data?.[0]
  } catch (error: any) {
    console.error("Error creating employee:", error)

    // If the table doesn't exist, return a mock employee
    if (error.message?.includes("does not exist") || error.code === "42P01") {
      // Create a mock employee with a random ID
      const mockEmployee = {
        id: Math.floor(Math.random() * 1000) + 100,
        ...employee,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store in localStorage for persistence in preview environment
      if (typeof window !== "undefined") {
        try {
          // Get existing mock employees
          const storedEmployees = localStorage.getItem("mockEmployees") || "[]"
          const employees = JSON.parse(storedEmployees)

          // Add the new employee
          employees.push(mockEmployee)

          // Save back to localStorage
          localStorage.setItem("mockEmployees", JSON.stringify(employees))
        } catch (e) {
          console.warn("Failed to save employee to localStorage:", e)
        }
      }

      return mockEmployee
    }

    throw new Error(`Failed to create employee: ${error.message || JSON.stringify(error)}`)
  }
}

// Update an employee
export async function updateEmployee(
  id: number,
  employee: Partial<Omit<Employee, "id" | "created_at" | "updated_at">>,
) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("employees")
      .update({
        ...employee,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      throw error
    }

    return data?.[0]
  } catch (error: any) {
    console.error("Error updating employee:", error)

    // If the table doesn't exist, return a mock updated employee
    if (error.message?.includes("does not exist") || error.code === "42P01") {
      // Get the mock employee and update it
      const mockEmployee = getMockEmployeeById(id)
      if (mockEmployee) {
        const updatedEmployee = {
          ...mockEmployee,
          ...employee,
          updated_at: new Date().toISOString(),
        }

        // Update in localStorage (only in browser environment)
        if (typeof window !== "undefined") {
          try {
            // Get existing mock employees
            const storedEmployees = localStorage.getItem("mockEmployees") || "[]"
            let employees = JSON.parse(storedEmployees)

            // Update the employee
            employees = employees.map((emp: any) => (emp.id === id ? updatedEmployee : emp))

            // Save back to localStorage
            localStorage.setItem("mockEmployees", JSON.stringify(employees))
          } catch (e) {
            console.warn("Failed to update employee in localStorage:", e)
          }
        }

        return updatedEmployee
      }
    }

    throw new Error(`Failed to update employee: ${error.message || "Unknown error"}`)
  }
}

// Delete an employee (soft delete by setting is_active to false)
export async function deleteEmployee(id: number) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("employees")
      .update({
        is_active: false,
        end_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      throw error
    }

    return data?.[0]
  } catch (error: any) {
    console.error("Error deleting employee:", error)

    // If the table doesn't exist, return a mock deleted employee
    if (error.message?.includes("does not exist") || error.code === "42P01") {
      // Get the mock employee and mark as inactive
      const mockEmployee = getMockEmployeeById(id)
      if (mockEmployee) {
        const updatedEmployee = {
          ...mockEmployee,
          is_active: false,
          end_date: new Date().toISOString().split("T")[0],
          updated_at: new Date().toISOString(),
        }

        // Update in localStorage (only in browser environment)
        if (typeof window !== "undefined") {
          try {
            // Get existing mock employees
            const storedEmployees = localStorage.getItem("mockEmployees") || "[]"
            let employees = JSON.parse(storedEmployees)

            // Update the employee
            employees = employees.map((emp: any) => (emp.id === id ? updatedEmployee : emp))

            // Save back to localStorage
            localStorage.setItem("mockEmployees", JSON.stringify(employees))
          } catch (e) {
            console.warn("Failed to update employee in localStorage:", e)
          }
        }

        return updatedEmployee
      }
    }

    throw new Error(`Failed to delete employee: ${error.message || "Unknown error"}`)
  }
}

// Hard delete an employee (for admin use only)
export async function hardDeleteEmployee(id: number) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      throw error
    }

    return true
  } catch (error: any) {
    console.error("Error hard deleting employee:", error)

    // If the table doesn't exist, just return success
    if (error.message?.includes("does not exist") || error.code === "42P01") {
      // Remove from localStorage (only in browser environment)
      if (typeof window !== "undefined") {
        try {
          // Get existing mock employees
          const storedEmployees = localStorage.getItem("mockEmployees") || "[]"
          let employees = JSON.parse(storedEmployees)

          // Remove the employee
          employees = employees.filter((emp: any) => emp.id !== id)

          // Save back to localStorage
          localStorage.setItem("mockEmployees", JSON.stringify(employees))
        } catch (e) {
          console.warn("Failed to remove employee from localStorage:", e)
        }
      }
      return true
    }

    throw new Error(`Failed to hard delete employee: ${error.message || "Unknown error"}`)
  }
}
