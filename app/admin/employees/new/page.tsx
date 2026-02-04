import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeForm } from "@/components/employee-form"

export default function NewEmployeePage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Add New Employee</h1>
        <p className="text-muted-foreground">Create a new employee record</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Enter the details for the new employee. Required fields are marked with an asterisk (*).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  )
}
