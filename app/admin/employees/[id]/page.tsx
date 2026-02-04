"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

import { EmployeeForm } from "@/components/employee-form"
import { getEmployeeById, type Employee } from "@/lib/data-service"

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmployee() {
      try {
        setLoading(true)
        setError(null)

        const id = Number.parseInt(params.id)
        if (isNaN(id)) {
          throw new Error("Invalid employee ID")
        }

        const employeeData = await getEmployeeById(id)
        setEmployee(employeeData)
      } catch (error: any) {
        console.error("Error fetching employee:", error)
        setError(error.message || "Failed to load employee information")
        toast({
          title: "Error",
          description: "Failed to load employee information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !employee) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Error</h1>
          <p className="text-muted-foreground">{error || "Employee not found"}</p>
        </div>

        <Button onClick={() => router.push("/admin/employees")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/employees")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
        <h1 className="text-2xl font-bold mb-1">Edit Employee: {employee.name}</h1>
        <p className="text-muted-foreground">Update employee information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Update the details for this employee. Required fields are marked with an asterisk (*).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm employee={employee} isEdit={true} />
        </CardContent>
      </Card>
    </div>
  )
}
