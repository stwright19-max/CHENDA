"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { getLocations, type Employee } from "@/lib/data-service"
import { createEmployeeAction, updateEmployeeAction } from "@/app/actions/employee-actions"

interface EmployeeFormProps {
  employee?: Employee
  isEdit?: boolean
}

export function EmployeeForm({ employee, isEdit = false }: EmployeeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locations, setLocations] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(
    employee?.start_date ? new Date(employee.start_date) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(employee?.end_date ? new Date(employee.end_date) : undefined)
  const [isActive, setIsActive] = useState(employee?.is_active !== false)
  const [daysOff, setDaysOff] = useState<string>(employee?.days_off?.join(", ") || "")

  // Fetch locations
  useEffect(() => {
    async function fetchLocations() {
      try {
        const locationsData = await getLocations()
        setLocations(locationsData)
      } catch (error) {
        console.error("Error fetching locations:", error)
        toast({
          title: "Error",
          description: "Failed to load locations. Using default values.",
          variant: "destructive",
        })
        setLocations(["Waltham", "Dedham", "Woburn", "Westboro", "Remote"])
      }
    }

    fetchLocations()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add dates to form data
      if (startDate) {
        formData.set("start_date", format(startDate, "yyyy-MM-dd"))
      }

      if (endDate) {
        formData.set("end_date", format(endDate, "yyyy-MM-dd"))
      }

      // Add is_active to form data
      formData.set("is_active", isActive.toString())

      // Add days_off to form data
      formData.set("days_off", daysOff)

      let result

      if (isEdit && employee) {
        // Update existing employee
        result = await updateEmployeeAction(employee.id, formData)
      } else {
        // Create new employee
        result = await createEmployeeAction(formData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: isEdit ? "Employee updated successfully" : "New employee created successfully",
        })
        router.push("/admin/employees")
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Department options
  const departments = [
    "Clinical",
    "Administrative",
    "Coordinator",
    "Provider",
    "Management",
    "IT",
    "HR",
    "Finance",
    "Other",
  ]

  // Role options
  const roles = {
    Clinical: ["Medical Assistant", "Nurse", "Physician Assistant", "Nurse Practitioner", "Other"],
    Administrative: ["Receptionist", "Office Manager", "Administrative Assistant", "Other"],
    Coordinator: ["Patient Coordinator", "Schedule Coordinator", "Other"],
    Provider: ["Physician", "Surgeon", "Specialist", "Primary Care Physician", "Other"],
    Management: ["Director", "Manager", "Supervisor", "Other"],
    IT: ["IT Support", "Systems Administrator", "Developer", "Other"],
    HR: ["HR Manager", "HR Specialist", "Recruiter", "Other"],
    Finance: ["Accountant", "Billing Specialist", "Financial Analyst", "Other"],
    Other: ["Other"],
  }

  // Get the selected department
  const selectedDepartment = employee?.department || "Clinical"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" name="name" defaultValue={employee?.name || ""} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={employee?.email || ""} />
          </div>

          <div>
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select name="department" defaultValue={employee?.department || "Clinical"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">
              Role <span className="text-destructive">*</span>
            </Label>
            <Select name="role" defaultValue={employee?.role || ""} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles[selectedDepartment as keyof typeof roles]?.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Select name="location" defaultValue={employee?.location || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_location">No location</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {isEdit && (
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div>
            <Label htmlFor="days_off">Days Off (comma separated)</Label>
            <Input
              id="days_off"
              name="days_off"
              value={daysOff}
              onChange={(e) => setDaysOff(e.target.value)}
              placeholder="e.g. Monday, Friday"
            />
            <p className="text-xs text-muted-foreground mt-1">Enter days of the week separated by commas</p>
          </div>

          {isEdit && (
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="is_active">Active Employee</Label>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={employee?.notes || ""} rows={4} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/employees")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Employee" : "Create Employee"}
        </Button>
      </div>
    </form>
  )
}
