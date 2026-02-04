"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Mail, MapPin, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

import { getEmployees, type Employee } from "@/lib/data-service"

export default function StaffDirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const data = await getEmployees({ isActive: true })
      setEmployees(data)
      setFilteredEmployees(data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        title: "Error",
        description: "Failed to load staff directory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Filter employees based on search and tab
  useEffect(() => {
    if (employees.length === 0) return

    let filtered = [...employees]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          (employee.department && employee.department.toLowerCase().includes(query)) ||
          (employee.role && employee.role.toLowerCase().includes(query)) ||
          (employee.location && employee.location.toLowerCase().includes(query)),
      )
    }

    // Apply department filter
    if (activeTab !== "all") {
      filtered = filtered.filter((employee) => employee.department === activeTab)
    }

    setFilteredEmployees(filtered)
  }, [employees, searchQuery, activeTab])

  // Get unique departments for tabs
  const departments = ["all", ...new Set(employees.map((employee) => employee.department))]

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Staff Directory</h1>
        <p className="text-muted-foreground">Browse all staff members</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department, role, or location..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
      </div>

      {/* Department tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          {departments.map((dept) => (
            <TabsTrigger key={dept} value={dept} className="capitalize">
              {dept === "all" ? "All Departments" : dept}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <StaffDirectorySkeleton />
          ) : filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <StaffCard key={employee.id} employee={employee} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">No staff members found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Staff Card Component
function StaffCard({ employee }: { employee: Employee }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{employee.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{employee.role}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{employee.department}</span>
          </div>
          {employee.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{employee.location}</span>
            </div>
          )}
          {employee.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="truncate">{employee.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton loader for staff directory
function StaffDirectorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
