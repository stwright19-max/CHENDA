"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Save, Trash, AlertCircle, Info, Edit, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Provider {
  id: string | number
  name: string
  department?: string
  title: string
  hasReferences?: boolean
  originalData?: {
    name: string
    department?: string
    title: string
  }
}

export default function ProviderManagementPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [newName, setNewName] = useState("")
  const [nameChangeDialogOpen, setNameChangeDialogOpen] = useState(false)
  const [changingName, setChangingName] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<{
    providers: number
    assignments: number
    preferences: number
  } | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { data, error } = await supabase.from("providers").select("*").order("name")

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        setProviders([])
        return
      }

      // Check which providers have references in ma_assignments
      const providersWithReferences = await checkProviderReferences()

      // Ensure all fields are strings, not null
      const sanitizedProviders = data.map((provider) => {
        const hasReferences = providersWithReferences.includes(provider.name)
        return {
          ...provider,
          name: provider.name || "",
          department: provider.department || "",
          title: provider.title || "",
          hasReferences,
          originalData: {
            name: provider.name || "",
            department: provider.department || "",
            title: provider.title || "",
          },
        }
      })
      setProviders(sanitizedProviders)
    } catch (error: any) {
      console.error("Error fetching providers:", error)
      setError("Failed to load providers: " + error.message)
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  // Check which providers have references in ma_assignments
  const checkProviderReferences = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase.from("ma_assignments").select("provider_name").not("provider_name", "is", null)

      if (!data || data.length === 0) {
        return []
      }

      // Get unique provider names
      return [...new Set(data.map((item) => item.provider_name))]
    } catch (error) {
      console.error("Error checking provider references:", error)
      return []
    }
  }

  const handleSaveProviders = async () => {
    try {
      setSaving(true)
      setError(null)

      const supabase = createClient()
      const updatedProviders = [...providers]
      const errors = []

      // Update or insert providers
      for (const provider of providers) {
        try {
          if (typeof provider.id === "string" && provider.id.startsWith("new-")) {
            // Insert new provider
            const { error, data } = await supabase
              .from("providers")
              .insert({
                name: provider.name || "",
                title: provider.title || "",
                department: provider.department || "",
              })
              .select()

            if (error) throw error

            // Update the provider ID in our local state if we got a response
            if (data && data.length > 0) {
              const index = updatedProviders.findIndex((p) => p.id === provider.id)
              if (index !== -1) {
                updatedProviders[index] = {
                  ...updatedProviders[index],
                  id: data[0].id,
                  originalData: {
                    name: data[0].name || "",
                    department: data[0].department || "",
                    title: data[0].title || "",
                  },
                }
              }
            }
          } else {
            // For providers with references, don't update the name directly
            if (provider.hasReferences && provider.name !== provider.originalData?.name) {
              // Skip name update for providers with references - they need to use the safe update method
              const { error } = await supabase
                .from("providers")
                .update({
                  title: provider.title || "",
                  department: provider.department || "",
                })
                .eq("id", provider.id)

              if (error) throw error
            } else {
              // Update existing provider including name (for providers without references)
              const { error } = await supabase
                .from("providers")
                .update({
                  name: provider.name || "",
                  title: provider.title || "",
                  department: provider.department || "",
                })
                .eq("id", provider.id)

              if (error) throw error
            }
          }
        } catch (error: any) {
          console.error(`Error saving provider ${provider.id}:`, error)
          errors.push(`Provider ${provider.name}: ${error.message || "Unknown error"}`)
        }
      }

      // Update providers with new IDs and originalData
      setProviders(updatedProviders)

      if (errors.length > 0) {
        setError(`Some providers could not be saved: ${errors.join("; ")}`)
        toast({
          title: "Partial Success",
          description: "Some providers were saved, but others encountered errors.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Provider information saved successfully",
        })
      }
    } catch (error: any) {
      console.error("Error saving providers:", error)
      setError(error.message || "Failed to save provider information")
      toast({
        title: "Error",
        description: "Failed to save provider information",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddProvider = () => {
    // Generate a temporary ID for new providers
    const tempId = `new-${Date.now()}`
    setProviders([
      ...providers,
      {
        id: tempId,
        name: "New Provider",
        department: "",
        title: "Provider",
        originalData: {
          name: "New Provider",
          department: "",
          title: "Provider",
        },
      },
    ])
  }

  const handleRemoveProvider = async (id: string | number) => {
    try {
      // For new providers with temporary IDs, just remove from state
      if (typeof id === "string" && id.startsWith("new-")) {
        setProviders(providers.filter((p) => p.id !== id))
        return
      }

      const provider = providers.find((p) => p.id === id)
      if (!provider) return

      // Don't allow deletion of providers with references
      if (provider.hasReferences) {
        toast({
          title: "Cannot Delete",
          description: "This provider is referenced in MA assignments and cannot be deleted.",
          variant: "destructive",
        })
        return
      }

      const supabase = createClient()
      const { error } = await supabase.from("providers").delete().eq("id", id)

      if (error) throw error

      // Update the UI
      setProviders(providers.filter((p) => p.id !== id))

      toast({
        title: "Success",
        description: "Provider deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting provider:", error)
      setError(error.message || "Failed to delete provider")
      toast({
        title: "Error",
        description: "Failed to delete provider",
        variant: "destructive",
      })
    } finally {
    }
  }

  const handleUpdateProvider = (id: string | number, field: keyof Provider, value: string) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  // Check if a provider has been modified from its original state
  const isProviderModified = (provider: Provider) => {
    if (!provider.originalData) return true
    return (
      provider.name !== provider.originalData.name ||
      provider.department !== provider.originalData.department ||
      provider.title !== provider.originalData.title
    )
  }

  // Open the name change dialog for a provider
  const openNameChangeDialog = (provider: Provider) => {
    setSelectedProvider(provider)
    setNewName(provider.name)
    setNameChangeDialogOpen(true)
  }

  // Handle safe name change for a provider with references
  const handleSafeNameChange = async () => {
    if (!selectedProvider || !newName.trim()) return

    try {
      setChangingName(true)
      setUpdateStatus(null)
      const supabase = createClient()
      const oldName = selectedProvider.name

      // Call the stored procedure we created
      const { data, error } = await supabase.rpc("update_provider_name", {
        provider_id: selectedProvider.id.toString(),
        new_provider_name: newName,
      })

      if (error) throw error

      // Parse the result to get counts
      if (data) {
        setUpdateStatus({
          providers: data.providers_updated || 0,
          assignments: data.assignments_updated || 0,
          preferences: data.preferences_updated || 0,
        })
      }

      toast({
        title: "Success",
        description: `Provider name updated from "${oldName}" to "${newName}"`,
      })

      // Refresh providers list
      await fetchProviders()
      setNameChangeDialogOpen(false)
    } catch (error: any) {
      console.error("Error changing provider name:", error)
      setError(`Failed to change provider name: ${error.message}`)
      toast({
        title: "Error",
        description: `Failed to change provider name: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setChangingName(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Provider Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProviders}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddProvider}>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
          <Button onClick={handleSaveProviders} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {providers.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground mb-4">No providers found. Add a new provider to get started.</p>
          <Button onClick={handleAddProvider}>
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {providers.map((provider) => (
            <Card key={provider.id.toString()} className={provider.hasReferences ? "border-amber-200" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <div className="flex items-center">
                    {provider.name}
                    {provider.hasReferences && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        Referenced
                      </span>
                    )}
                    {isProviderModified(provider) && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Modified</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {provider.hasReferences && (
                      <Button variant="outline" size="sm" onClick={() => openNameChangeDialog(provider)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Change Name
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveProvider(provider.id)}
                      disabled={provider.hasReferences}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${provider.id}`}>Name</Label>
                    <Input
                      id={`name-${provider.id}`}
                      value={provider.name || ""}
                      onChange={(e) => handleUpdateProvider(provider.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`department-${provider.id}`}>Department</Label>
                    <Input
                      id={`department-${provider.id}`}
                      value={provider.department || ""}
                      onChange={(e) => handleUpdateProvider(provider.id, "department", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`title-${provider.id}`}>Title</Label>
                    <Input
                      id={`title-${provider.id}`}
                      value={provider.title || ""}
                      onChange={(e) => handleUpdateProvider(provider.id, "title", e.target.value)}
                    />
                  </div>
                </div>
                {provider.hasReferences && (
                  <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    <strong>Warning:</strong> This provider is referenced in MA assignments. To change the name safely,
                    use the "Change Name" button which will update all references.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Name Change Dialog */}
      <Dialog open={nameChangeDialogOpen} onOpenChange={setNameChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Provider Name</DialogTitle>
            <DialogDescription>
              This will safely update the provider name and all references to it in the database.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-name">Current Name</Label>
              <Input id="current-name" value={selectedProvider?.name || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name">New Name</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new provider name"
              />
            </div>
            {updateStatus && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Update Summary</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Providers updated: {updateStatus.providers}</li>
                    <li>MA assignments updated: {updateStatus.assignments}</li>
                    <li>MA preferences updated: {updateStatus.preferences}</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNameChangeDialogOpen(false)} disabled={changingName}>
              Cancel
            </Button>
            <Button onClick={handleSafeNameChange} disabled={changingName || !newName.trim()}>
              {changingName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
