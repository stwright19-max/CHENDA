"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ProviderFilterProps {
  providers: { id: number; name: string; department?: string; title?: string }[]
  selectedProvider: string | null
  onProviderChange: (provider: string | null) => void
}

export function ProviderFilter({ providers, selectedProvider, onProviderChange }: ProviderFilterProps) {
  const [open, setOpen] = useState(false)

  const selectedProviderName = selectedProvider
    ? providers.find((provider) => provider.name === selectedProvider)?.name
    : null

  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium">Provider</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
            {selectedProviderName || "All Providers"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search provider..." />
            <CommandList>
              <CommandEmpty>No provider found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    onProviderChange(null)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <Check className={cn("mr-2 h-4 w-4", !selectedProvider ? "opacity-100" : "opacity-0")} />
                  All Providers
                </CommandItem>
                {providers.map((provider) => (
                  <CommandItem
                    key={provider.id}
                    onSelect={() => {
                      onProviderChange(provider.name)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedProvider === provider.name ? "opacity-100" : "opacity-0")}
                    />
                    {provider.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
