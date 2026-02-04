"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Check, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

import { importEmployeesAction } from "@/app/actions/employee-actions"

export default function ImportEmployeesPage() {
  const router = useRouter()
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    success: boolean
    imported: number
    skipped: number
    errors: number
    details?: string[]
  } | null>(null)

  const handleImport = async () => {
    try {
      setIsImporting(true)
      setProgress(10)

      // Call the server action to import employees
      const result = await importEmployeesAction()

      setProgress(100)
      setResults(result)

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${result.imported} employees, skipped ${result.skipped} duplicates.`,
        })
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `Imported ${result.imported} employees, encountered ${result.errors} errors.`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error importing employees:", error)
      setResults({
        success: false,
        imported: 0,
        skipped: 0,
        errors: 1,
        details: [error.message || "Unknown error occurred"],
      })
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import employees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/admin/employees")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
        <h1 className="text-2xl font-bold mb-1">Import Employees</h1>
        <p className="text-muted-foreground">
          Import existing MAs and Providers from the database into the employee management system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Existing Staff</CardTitle>
          <CardDescription>
            This will scan the database for Medical Assistants and Providers and create employee records for them.
            Duplicate entries will be skipped.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isImporting ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">
                Importing employees... This may take a moment.
              </p>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <Alert variant={results.success ? "default" : "destructive"}>
                {results.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{results.success ? "Import Successful" : "Import Completed with Errors"}</AlertTitle>
                <AlertDescription>
                  <p>
                    Imported {results.imported} employees, skipped {results.skipped} duplicates, encountered{" "}
                    {results.errors} errors.
                  </p>
                  {results.details && results.details.length > 0 && (
                    <ul className="mt-2 list-disc pl-5 text-sm">
                      {results.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button onClick={() => router.push("/admin/employees")}>
                  <Check className="mr-2 h-4 w-4" />
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>This process will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Extract all unique Medical Assistants from MA assignments</li>
                <li>Extract all unique Providers from the providers table and clinic slots</li>
                <li>Create employee records for each unique person</li>
                <li>Skip any duplicates based on name</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Note: This is a one-time operation. You can run it multiple times safely as it will skip existing
                employees with the same name.
              </p>
            </div>
          )}
        </CardContent>
        {!isImporting && !results && (
          <CardFooter className="flex justify-end">
            <Button onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Start Import
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
