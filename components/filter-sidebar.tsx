"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Check, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface FilterOption {
  id: string
  label: string
}

interface FilterGroup {
  id: string
  title: string
  options: FilterOption[]
}

interface FilterSidebarProps {
  groups: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onChange: (groupId: string, optionId: string, isSelected: boolean) => void
  onClearAll: () => void
  className?: string
}

export function FilterSidebar({ groups, selectedFilters, onChange, onClearAll, className }: FilterSidebarProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const hasActiveFilters = Object.values(selectedFilters).some((group) => group.length > 0)

  const FilterContent = () => (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{group.title}</h3>
            {selectedFilters[group.id]?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground"
                onClick={() => {
                  const newSelectedFilters = { ...selectedFilters }
                  newSelectedFilters[group.id] = []
                  group.options.forEach((option) => {
                    onChange(group.id, option.id, false)
                  })
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {group.options.map((option) => {
              const isSelected = selectedFilters[group.id]?.includes(option.id) || false
              return (
                <Button
                  key={option.id}
                  variant="ghost"
                  size="sm"
                  className={cn("justify-start w-full font-normal", isSelected && "bg-muted")}
                  onClick={() => onChange(group.id, option.id, !isSelected)}
                >
                  <div className="flex items-center w-full">
                    <div
                      className={cn(
                        "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
                        isSelected ? "bg-primary border-primary text-primary-foreground" : "border-primary",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </Button>
              )
            })}
          </div>
          <Separator className="mt-2" />
        </div>
      ))}

      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={onClearAll}>
          Clear All Filters
        </Button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className={cn("flex items-center gap-1", hasActiveFilters && "bg-muted")}>
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {Object.values(selectedFilters).flat().length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="px-1 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <FilterContent />
      </CardContent>
    </Card>
  )
}
