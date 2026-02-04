"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Grid3X3 } from "lucide-react"
import {
  BLOCK_SCHEDULE,
  LOCATIONS,
  DAYS_OF_WEEK,
  ROOM_CONFIGS,
  getAllProviders,
  getProviderSchedule,
  type Location,
} from "@/lib/block-schedule-data"
import { cn } from "@/lib/utils"

// Color mapping for providers (consistent colors)
const providerColors: Record<string, string> = {}
const colorPalette = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-amber-100 text-amber-800 border-amber-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-teal-100 text-teal-800 border-teal-200",
  "bg-rose-100 text-rose-800 border-rose-200",
]

function getProviderColor(provider: string): string {
  if (provider === "Open") return "bg-gray-50 text-gray-400 border-gray-200 border-dashed"
  if (provider === "N/A") return "bg-gray-100 text-gray-400 border-gray-200"
  
  if (!providerColors[provider]) {
    const index = Object.keys(providerColors).length % colorPalette.length
    providerColors[provider] = colorPalette[index]
  }
  return providerColors[provider]
}

function ScheduleCell({ provider }: { provider: string }) {
  const colorClass = getProviderColor(provider)
  
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium rounded border text-center truncate",
        colorClass
      )}
      title={provider}
    >
      {provider}
    </div>
  )
}

function WeeklyScheduleTable({ location }: { location: Location }) {
  const rooms = ROOM_CONFIGS[location]
  const locationEntries = BLOCK_SCHEDULE.entries.filter(e => e.location === location)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-2 font-medium sticky left-0 bg-muted/50">Room</th>
            {DAYS_OF_WEEK.map(day => (
              <th key={day} colSpan={2} className="text-center p-2 font-medium border-l">
                {day}
              </th>
            ))}
          </tr>
          <tr className="border-b bg-muted/30 text-xs">
            <th className="text-left p-1 sticky left-0 bg-muted/30"></th>
            {DAYS_OF_WEEK.map(day => (
              <th key={`${day}-blocks`} colSpan={2} className="text-center border-l">
                <div className="flex">
                  <span className="flex-1 py-1 border-r text-muted-foreground">AM</span>
                  <span className="flex-1 py-1 text-muted-foreground">PM</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room} className="border-b hover:bg-muted/20">
              <td className="p-2 font-medium text-xs whitespace-nowrap sticky left-0 bg-background">
                {room}
              </td>
              {DAYS_OF_WEEK.map(day => {
                const amEntry = locationEntries.find(e => e.dayOfWeek === day && e.block === "AM")
                const pmEntry = locationEntries.find(e => e.dayOfWeek === day && e.block === "PM")
                const amProvider = amEntry?.rooms[room] || "N/A"
                const pmProvider = pmEntry?.rooms[room] || "N/A"
                
                return (
                  <td key={`${day}-cell`} colSpan={2} className="p-1 border-l">
                    <div className="flex gap-1">
                      <div className="flex-1">
                        <ScheduleCell provider={amProvider} />
                      </div>
                      <div className="flex-1">
                        <ScheduleCell provider={pmProvider} />
                      </div>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProviderScheduleView({ providerName }: { providerName: string }) {
  const schedule = getProviderSchedule(providerName)
  
  if (schedule.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No schedule found for {providerName}
      </div>
    )
  }

  // Group by location
  const byLocation: Record<string, typeof schedule> = {}
  for (const entry of schedule) {
    if (!byLocation[entry.location]) {
      byLocation[entry.location] = []
    }
    byLocation[entry.location].push(entry)
  }

  return (
    <div className="space-y-4">
      {Object.entries(byLocation).map(([location, entries]) => (
        <Card key={location}>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {location}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-5 gap-2">
              {DAYS_OF_WEEK.map(day => {
                const dayEntries = entries.filter(e => e.dayOfWeek === day)
                const amEntry = dayEntries.find(e => e.block === "AM")
                const pmEntry = dayEntries.find(e => e.block === "PM")
                
                return (
                  <div key={day} className="border rounded-lg p-2">
                    <div className="text-xs font-medium text-center mb-2">{day}</div>
                    <div className="space-y-1 text-xs">
                      {amEntry && (
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          AM: {amEntry.room}
                        </div>
                      )}
                      {pmEntry && (
                        <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded">
                          PM: {pmEntry.room}
                        </div>
                      )}
                      {!amEntry && !pmEntry && (
                        <div className="text-muted-foreground text-center">-</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ProviderListView({ onSelectProvider }: { onSelectProvider: (name: string) => void }) {
  const providers = getAllProviders()
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
      {providers.map(provider => (
        <button
          key={provider}
          type="button"
          onClick={() => onSelectProvider(provider)}
          className={cn(
            "px-3 py-2 rounded-lg border text-sm font-medium text-center hover:shadow-md transition-shadow cursor-pointer",
            getProviderColor(provider)
          )}
        >
          {provider}
        </button>
      ))}
    </div>
  )
}

export default function BlockSchedulePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location>("Waltham")
  const [viewMode, setViewMode] = useState<"master" | "providers">("master")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Grid3X3 className="h-6 w-6" />
              Block Schedule - Week 1
            </h1>
            <p className="text-muted-foreground">
              Provider room assignments by location
            </p>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => {
            setViewMode(v as typeof viewMode)
            setSelectedProvider(null)
          }}>
            <TabsList>
              <TabsTrigger value="master" className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Master Schedule
              </TabsTrigger>
              <TabsTrigger value="providers" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                By Provider
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Master Schedule View */}
        {viewMode === "master" && (
          <>
            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Location:</span>
              <Select value={selectedLocation} onValueChange={(v) => setSelectedLocation(v as Location)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {selectedLocation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyScheduleTable location={selectedLocation} />
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 px-2 py-1 text-xs rounded border bg-gray-50 text-gray-400 border-gray-200 border-dashed text-center">
                      Open
                    </div>
                    <span className="text-xs text-muted-foreground">Available slot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 px-2 py-1 text-xs rounded border bg-gray-100 text-gray-400 border-gray-200 text-center">
                      N/A
                    </div>
                    <span className="text-xs text-muted-foreground">Not available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Providers View */}
        {viewMode === "providers" && (
          <>
            {selectedProvider ? (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProvider(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    All Providers
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {selectedProvider}
                  </Badge>
                </div>
                <ProviderScheduleView providerName={selectedProvider} />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    All Providers
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click on a provider to view their schedule
                  </p>
                </CardHeader>
                <CardContent>
                  <ProviderListView onSelectProvider={setSelectedProvider} />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
