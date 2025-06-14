"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, CalendarIcon, AlertTriangle, Plus, Trash2, Settings, Save, User, Scissors } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"

// Types matching your DTOs exactly
type WorkflowConfig = {
  id: number
  title: string
  description: string
  created_at: string
  updated_at: string | null
}

type WorkflowStep = {
  id: number
  stepNo: number
  notes: string
  status: "pending" | "in_progress" | "completed" | string
  estimatedHours: number
  actualHours: number
  completedAt: string | null
  config: WorkflowConfig
}

type ProjectDetails = {
  id: number
  orderId: number
  customerId: number
  description: string
  deadline: string // ISO date string
  rush: boolean
  instructions: string
  estimatedHours: number | null
  actualHours: string
  status: "pending" | "in_progress" | "completed" | string
  tailorId: number
  createdAt: string
  updatedAt: string | null
  customerName: string
  tailorName: string
  daysRemaining: number
  stepsCompleted: string
  totalSteps: string
  timeEfficiency: string
  workflows: WorkflowStep[]
}

// DTO types matching your backend exactly
interface CreateProjectWorkflow {
  stepNo: number
  configId: number
  notes: string
  estimatedHours: number
}

interface UpdateTailoringDto {
  orderId?: number
  customerId?: number
  description?: string
  deadline?: Date
  rush?: boolean
  instructions?: string
  tailorId?: number
  workflows?: CreateProjectWorkflow[]
}

// Loading skeleton components
const FormSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
)

export default function EditTailoringProject() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateTailoringDto>({
    defaultValues: {
      rush: false,
      workflows: [],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "workflows",
  })

  const watchedValues = watch()

  // Fetch project details using the same API as detail page
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
    refetch,
  } = useQuery<ProjectDetails>({
    queryKey: ["tailoring-project", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5005/api/v1/tailoring/${id}`)
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message || `Failed to load project #${id}`)
      }
      return json
    },
    enabled: !!id,
  })

  // Fetch workflow templates
  const { data: workflowConfigs = [] } = useQuery<WorkflowConfig[]>({
    queryKey: ["workflow-configs"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5005/api/v1/tailoring/workflow/templates")
      const json = await response.json()
      if (!response.ok) {
        toast.error("Failed to load workflow templates!")
      }
      return json
    },
  })

  // Populate form when project data loads
  useEffect(() => {
    if (project) {
      reset({
        orderId: project.orderId,
        customerId: project.customerId,
        description: project.description,
        deadline: new Date(project.deadline),
        rush: project.rush,
        instructions: project.instructions,
        tailorId: project.tailorId,
        workflows: project.workflows.map((workflow) => ({
          stepNo: workflow.stepNo,
          configId: workflow.config.id,
          notes: workflow.notes,
          estimatedHours: workflow.estimatedHours,
        })),
      })
    }
  }, [project, reset])

  const addWorkflowStep = () => {
    const nextStepNo = Math.max(0, ...fields.map((f) => f.stepNo)) + 1
    append({
      stepNo: nextStepNo,
      configId: 0,
      notes: "",
      estimatedHours: 1,
    })
  }

  const removeWorkflowStep = (index: number) => {
    if (fields.length > 1) {
      remove(index)
      // Update step numbers to maintain sequence
      const updatedWorkflows = fields
        .filter((_, idx) => idx !== index)
        .map((workflow, idx) => ({
          ...workflow,
          stepNo: idx + 1,
        }))
      replace(updatedWorkflows)
    }
  }

  const onSubmit = async (data: UpdateTailoringDto) => {
    try {
      setIsSubmitting(true)

      // Validate required fields
      if (!data.description?.trim()) {
        toast.error("Project description is required")
        return
      }

      if (!data.instructions?.trim()) {
        toast.error("Instructions are required")
        return
      }

      if (!data.deadline) {
        toast.error("Deadline is required")
        return
      }

      // Validate workflows if provided
      if (data.workflows && data.workflows.length > 0) {
        for (const workflow of data.workflows) {
          if (!workflow.configId || workflow.configId === 0) {
            toast.error("Please select a configuration for all workflow steps")
            return
          }
          if (!workflow.notes.trim()) {
            toast.error("Notes are required for all workflow steps")
            return
          }
          if (!workflow.estimatedHours || workflow.estimatedHours <= 0) {
            toast.error("Estimated hours must be greater than 0 for all workflow steps")
            return
          }
        }
      }

      const response = await fetch(`http://localhost:5005/api/v1/tailoring/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to update tailoring project")
      }

      toast.success(result.message || "Tailoring project updated successfully!")
      router.push(`/tailoring/${id}`)
    } catch (error) {
      console.error("Error updating tailoring project:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update project")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (projectError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-600 text-lg font-medium">Failed to load project</div>
        <p className="text-gray-600">
          {projectError instanceof Error ? projectError.message : "Unknown error occurred"}
        </p>
        <Link href="/tailoring">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    )
  }

  if (isProjectLoading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-6">
          <Skeleton className="h-10 w-10" />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Form Skeleton */}
        <Card className="border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-6 py-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <div className="p-8">
            <FormSkeleton />
          </div>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-gray-600 text-lg font-medium">Project not found</div>
        <Link href="/tailoring">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link href={`/tailoring/${id}`}>
          <Button variant="outline" size="icon" className="border-gray-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Project #{project.id}</h1>
            {project.rush && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex gap-1 items-center">
                <AlertTriangle className="h-3 w-3" />
                Rush Order
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">Update project details and workflow configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-gray-200 shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-none p-0 h-auto">
              <TabsTrigger
                value="details"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-blue-600 text-white">
                    1
                  </div>
                  Project Details
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="workflows"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-blue-600 text-white">
                    2
                  </div>
                  Workflows
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              <TabsContent value="details" className="mt-0 space-y-8">
                <div className="grid gap-8">
                  {/* Customer and Tailor Info (Read-only) */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                          <User className="h-5 w-5 text-blue-600" />
                          Customer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {project.customerName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 text-lg">{project.customerName}</div>
                            <div className="text-sm text-gray-500">Customer ID: {project.customerId}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                      <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                          <Scissors className="h-5 w-5 text-blue-600" />
                          Assigned Tailor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {project.tailorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 text-lg">{project.tailorName}</div>
                            <div className="text-sm text-gray-500">Tailor ID: {project.tailorId}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Editable Project Fields */}
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                      <CardTitle className="text-lg text-gray-900">Project Information</CardTitle>
                      <CardDescription className="text-gray-600">
                        Update the project details and requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                          Project Description *
                        </Label>
                        <Input
                          id="description"
                          {...register("description", {
                            required: "Project description is required",
                            minLength: {
                              value: 1,
                              message: "Description cannot be empty",
                            },
                          })}
                          placeholder="e.g., 2 Custom Kanduras with Traditional Embroidery"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Delivery Deadline *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                !watchedValues.deadline && "text-gray-500",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {watchedValues.deadline ? format(watchedValues.deadline, "PPP") : "Select delivery date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={watchedValues.deadline}
                              onSelect={(date) => setValue("deadline", date!)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.deadline && <p className="text-sm text-red-600">{errors.deadline.message}</p>}
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <Checkbox
                          id="rush"
                          {...register("rush")}
                          checked={watchedValues.rush}
                          onCheckedChange={(checked) => setValue("rush", checked === true)}
                        />
                        <Label htmlFor="rush" className="flex items-center gap-2 text-sm font-medium text-amber-800">
                          <AlertTriangle className="h-4 w-4" />
                          Rush Order (Priority Processing)
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                          Special Instructions *
                        </Label>
                        <Textarea
                          id="instructions"
                          {...register("instructions", {
                            required: "Instructions are required",
                            minLength: {
                              value: 1,
                              message: "Instructions cannot be empty",
                            },
                          })}
                          placeholder="Any special requirements, measurements notes, or design preferences..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                        {errors.instructions && <p className="text-sm text-red-600">{errors.instructions.message}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("workflows")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Next: Configure Workflows
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="workflows" className="mt-0 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                      <Settings className="h-5 w-5 text-blue-600" />
                      Project Workflows
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Configure the workflow steps for this tailoring project. Changes will synchronize existing steps
                      by step number.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="border-gray-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Step {index + 1}</CardTitle>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeWorkflowStep(index)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <input
                              type="hidden"
                              {...register(`workflows.${index}.stepNo` as const)}
                              value={index + 1}
                            />

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Workflow Configuration *</Label>
                              <Select
                                value={String(watchedValues.workflows?.[index]?.configId || "")}
                                onValueChange={(value) =>
                                  setValue(`workflows.${index}.configId`, Number.parseInt(value))
                                }
                              >
                                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select workflow configuration" />
                                </SelectTrigger>
                                <SelectContent>
                                  {workflowConfigs.map((config) => (
                                    <SelectItem key={config.id} value={String(config.id)}>
                                      <div>
                                        <div className="font-medium">{config.title}</div>
                                        <div className="text-sm text-gray-500">{config.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.workflows?.[index]?.configId && (
                                <p className="text-sm text-red-600">Configuration is required</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Estimated Hours *</Label>
                              <Input
                                type="number"
                                min="1"
                                {...register(`workflows.${index}.estimatedHours` as const, {
                                  valueAsNumber: true,
                                  required: "Estimated hours is required",
                                  min: {
                                    value: 1,
                                    message: "Estimated hours must be at least 1",
                                  },
                                })}
                                placeholder="Enter estimated hours"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                              {errors.workflows?.[index]?.estimatedHours && (
                                <p className="text-sm text-red-600">
                                  {errors.workflows[index]?.estimatedHours?.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Notes *</Label>
                              <Textarea
                                {...register(`workflows.${index}.notes` as const, {
                                  required: "Notes are required",
                                  minLength: {
                                    value: 1,
                                    message: "Notes cannot be empty",
                                  },
                                })}
                                placeholder="Enter specific notes for this workflow step..."
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={2}
                              />
                              {errors.workflows?.[index]?.notes && (
                                <p className="text-sm text-red-600">{errors.workflows[index]?.notes?.message}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addWorkflowStep}
                      className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Workflow Step
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                    className="border-gray-300"
                  >
                    Back to Details
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Updating..." : "Update Project"}
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </form>
    </div>
  )
}
