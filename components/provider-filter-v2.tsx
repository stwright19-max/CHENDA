"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Provider {
  id: number
  name: string
  department?: string
  title?: string
}

interface ProviderFilterProps {
  providers: Provider[]
  selectedProvider: string | null
  onProviderChange: (provider: string | null) => void
  className?: string
  buttonClassName?: string
  label?: string
  placeholder?: string
}

export function ProviderFilterV2({
  providers,
  selectedProvider,
  onProviderChange,
  className,
  buttonClassName,
  label = "Provider",
  placeholder = "All Providers",
}: ProviderFilterProps) {
  const [open, setOpen] = useState(false)

  const selectedProviderName = selectedProvider
    ? providers.find((provider) => provider.name === selectedProvider)?.name
    : null

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", buttonClassName)}
          >
            {selectedProviderName || placeholder}
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
                  {placeholder}
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
