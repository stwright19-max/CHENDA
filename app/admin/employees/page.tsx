"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Search, Edit, Trash2, RefreshCw, Calendar, Mail, MapPin, Briefcase, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

import { getEmployees, type Employee } from "@/lib/data-service"
import { deleteEmployeeAction } from "@/app/actions/employee-actions"

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Format days off for display
  const formatDaysOff = (daysOff: string[] | null) => {
    if (!daysOff || daysOff.length === 0) return "None"
    return daysOff.join(", ")
  }

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const isActive = activeTab === "active"
      const data = await getEmployees({ isActive, search: searchQuery })
      setEmployees(data)
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchEmployees()
  }, [activeTab])

  // Handle search
  const handleSearch = () => {
    fetchEmployees()
  }

  // Handle delete
  const handleDelete = async () => {
    if (!employeeToDelete) return

    try {
      setIsDeleting(true)
      const result = await deleteEmployeeAction(employeeToDelete.id)

      if (result.success) {
        toast({
          title: "Success",
          description: `${employeeToDelete.name} has been deactivated.`,
        })
        fetchEmployees()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate employee.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Employee Management</h1>
          <p className="text-muted-foreground">Manage staff information and schedules</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" onClick={fetchEmployees}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/employees/import")}>
            <Plus className="mr-2 h-4 w-4" />
            Import Staff
          </Button>
          <Button onClick={() => router.push("/admin/employees/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      {/* Tabs for active/inactive employees */}
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active Employees</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {loading ? (
            <EmployeeListSkeleton />
          ) : employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={() => router.push(`/admin/employees/${employee.id}`)}
                  onDelete={() => {
                    setEmployeeToDelete(employee)
                    setIsDeleteDialogOpen(true)
                  }}
                  formatDaysOff={formatDaysOff}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground mb-4">No active employees found.</p>
              <Button onClick={() => router.push("/admin/employees/new")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          {loading ? (
            <EmployeeListSkeleton />
          ) : employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={() => router.push(`/admin/employees/${employee.id}`)}
                  isInactive
                  formatDaysOff={formatDaysOff}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">No inactive employees found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {employeeToDelete?.name}? This will mark them as inactive but preserve
              their records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deactivating..." : "Deactivate Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Employee Card Component
function EmployeeCard({
  employee,
  onEdit,
  onDelete,
  isInactive = false,
  formatDaysOff,
}: {
  employee: Employee
  onEdit: () => void
  onDelete?: () => void
  isInactive?: boolean
  formatDaysOff: (daysOff: string[] | null) => string
}) {
  return (
    <Card className={isInactive ? "border-muted bg-muted/10" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{employee.name}</CardTitle>
            <CardDescription>{employee.role}</CardDescription>
          </div>
          <Badge variant={isInactive ? "outline" : "default"}>{isInactive ? "Inactive" : "Active"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
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
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Days off: {formatDaysOff(employee.days_off)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          {!isInactive && onDelete && (
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Deactivate
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Skeleton loader for employee list
function EmployeeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex justify-end gap-2 w-full">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
