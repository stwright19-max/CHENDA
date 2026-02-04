"use client"

import Link from "next/link"
import { format } from "date-fns"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface StaffSchedule {
  id: number | string
  name: string
  department: string
  location: string
  shift: string
  status: "On Duty" | "Off Duty" | "On Leave"
  assignment: string
}

interface ScheduleTableProps {
  data: StaffSchedule[]
  date: Date
  isOutOfOfficeView?: boolean
}

export function ScheduleTable({ data, date, isOutOfOfficeView = false }: ScheduleTableProps) {
  const formattedDate = format(date, "yyyy-MM-dd")
  const isMobile = useMediaQuery("(max-width: 640px)")

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((staff) => (
            <Card key={staff.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/staff/${staff.id}/schedule?from=${formattedDate}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {staff.name}
                    </Link>
                    <StatusBadge status={staff.status} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {staff.department} • {staff.location}
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                  {isOutOfOfficeView ? (
                    <div className="col-span-2">
                      <div className="font-medium text-xs text-muted-foreground mb-1">Status</div>
                      <div>{staff.status}</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="font-medium text-xs text-muted-foreground mb-1">Assignment</div>
                        <div>{staff.assignment}</div>
                      </div>
                      <div>
                        <div className="font-medium text-xs text-muted-foreground mb-1">Shift</div>
                        <div>{staff.shift || "8:30 AM - 5:00 PM"}</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 border rounded-md">
            No staff {isOutOfOfficeView ? "out of office" : "scheduled"} for this date and criteria.
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              {!isOutOfOfficeView && <TableHead>Assignment</TableHead>}
              {!isOutOfOfficeView && <TableHead>Shift</TableHead>}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/staff/${staff.id}/schedule?from=${formattedDate}`}
                      className="text-primary hover:underline"
                    >
                      {staff.name}
                    </Link>
                  </TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.location}</TableCell>
                  {!isOutOfOfficeView && <TableCell>{staff.assignment}</TableCell>}
                  {!isOutOfOfficeView && <TableCell>{staff.shift || "8:30 AM - 5:00 PM"}</TableCell>}
                  <TableCell>
                    <StatusBadge status={staff.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isOutOfOfficeView ? 4 : 6} className="h-24 text-center">
                  No staff {isOutOfOfficeView ? "out of office" : "scheduled"} for this date and criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: StaffSchedule["status"] }) {
  switch (status) {
    case "On Duty":
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
          On Duty
        </Badge>
      )
    case "Off Duty":
      return (
        <Badge variant="secondary" className="bg-slate-500 text-white">
          Off Duty
        </Badge>
      )
    case "On Leave":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-600 font-medium">
          On Leave
        </Badge>
      )
    default:
      return null
  }
}
