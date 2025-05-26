"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, CalendarIcon, Save, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ProjectWorkflow {
  id: number
  stepNo: number
  configId: number
  notes: string
  status: "pending" | "completed"
  completedAt?: Date
  config: {
    id: number
    title: string
    description: string
  }
}

interface ProjectDetails {
  id: number
  orderId: number
  customerId: number
  description: string
  deadline: Date
  rush: boolean
  instructions: string
  estimatedHours: number
  status: "pending" | "in-progress" | "completed"
  progress: number
  tailorId: number
  createdAt: Date
  updatedAt: Date
  customerName: string
  tailorName: string
  workflows: ProjectWorkflow[]
}

interface WorkflowTemplate {
  id: number
  title: string
  description: string
}

const workflowTemplates: WorkflowTemplate[] = [
  { id: 1, title: "Measurements & Design Consultation", description: "Take precise customer measurements" },
  { id: 2, title: "Fabric Selection & Material Preparation", description: "Select and prepare materials" },
  { id: 3, title: "Pattern Creation & Cutting", description: "Create patterns and cut fabric" },
  { id: 4, title: "Traditional Embroidery Work", description: "Apply embroidery patterns" },
  { id: 5, title: "First Fitting Appointment", description: "Customer fitting session" },
  { id: 6, title: "Final Adjustments & Refinements", description: "Make final adjustments" },
  { id: 7, title: "Quality Inspection & Finishing", description: "Final quality check" },
]

const mockProject: ProjectDetails = {
  id: 1,
  orderId: 1001,
  customerId: 1,
  description: "2 Custom Kanduras with Traditional Embroidery",
  deadline: new Date("2024-05-10"),
  rush: true,
  instructions: "Customer prefers navy blue with gold embroidery. Rush order for wedding.",
  estimatedHours: 24,
  status: "in-progress",
  progress: 60,
  tailorId: 1,
  createdAt: new Date("2024-05-02"),
  updatedAt: new Date("2024-05-05"),
  customerName: "Fatima Mohammed",
  tailorName: "Mohammed Ali",
  workflows: [
    {
      id: 1,
      stepNo: 1,
      configId: 1,
      notes: "Customer measurements taken. Prefers traditional collar style.",
      status: "completed",
      completedAt: new Date("2024-05-02"),
      config: { id: 1, title: "Measurements & Design Consultation", description: "Take precise customer measurements" },
    },
    {
      id: 2,
      stepNo: 2,
      configId: 2,
      notes: "Navy blue fabric selected. Premium cotton as requested.",
      status: "completed",
      completedAt: new Date("2024-05-03"),
      config: { id: 2, title: "Fabric Selection & Material Preparation", description: "Select and prepare materials" },
    },
    {
      id: 3,
      stepNo: 3,
      configId: 3,
      notes: "Patterns created according to measurements.",
      status: "completed",
      completedAt: new Date("2024-05-04"),
      config: { id: 3, title: "Pattern Creation & Cutting", description: "Create patterns and cut fabric" },
    },
    {
      id: 4,
      stepNo: 4,
      configId: 4,
      notes: "",
      status: "pending",
      config: { id: 4, title: "Traditional Embroidery Work", description: "Apply embroidery patterns" },
    },
  ],
}

export default function EditTailoringProject({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails>(mockProject)
  const [isAddWorkflowOpen, setIsAddWorkflowOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [newWorkflowNotes, setNewWorkflowNotes] = useState("")
  const [editingWorkflow, setEditingWorkflow] = useState<number | null>(null)
  const [workflowNotes, setWorkflowNotes] = useState("")

  const handleSaveProject = () => {
    // API call to update project
    console.log("Saving project:", project)
  }

  const handleAddWorkflow = () => {
    if (selectedTemplate) {
      const template = workflowTemplates.find((t) => t.id === selectedTemplate)
      if (template) {
        const newWorkflow: ProjectWorkflow = {
          id: Math.max(...project.workflows.map((w) => w.id)) + 1,
          stepNo: project.workflows.length + 1,
          configId: template.id,
          notes: newWorkflowNotes,
          status: "pending",
          config: template,
        }
        setProject({
          ...project,
          workflows: [...project.workflows, newWorkflow],
        })
        setSelectedTemplate(null)
        setNewWorkflowNotes("")
        setIsAddWorkflowOpen(false)
      }
    }
  }

  const handleUpdateWorkflowNotes = (workflowId: number) => {
    setProject({
      ...project,
      workflows: project.workflows.map((w) => (w.id === workflowId ? { ...w, notes: workflowNotes } : w)),
    })
    setEditingWorkflow(null)
    setWorkflowNotes("")
  }

  const handleDeleteWorkflow = (workflowId: number) => {
    setProject({
      ...project,
      workflows: project.workflows.filter((w) => w.id !== workflowId),
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <Link href={`/tailoring/${params.id}`}>
          <Button variant="outline" size="icon" className="border-gray-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Project TP-{project.id}</h1>
            {project.rush && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex gap-1 items-center">
                <AlertTriangle className="h-3 w-3" />
                Rush Order
              </Badge>
            )}
            {getStatusBadge(project.status)}
          </div>
          <p className="text-gray-600">Update project details and manage workflow steps</p>
        </div>
        <Button onClick={handleSaveProject} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Project Details Form */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <CardTitle className="text-lg text-gray-900">Project Information</CardTitle>
            <CardDescription>Update basic project details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Project Description
              </Label>
              <Input
                id="description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Delivery Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300",
                      !project.deadline && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {project.deadline ? format(project.deadline, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={project.deadline}
                    onSelect={(date) => date && setProject({ ...project, deadline: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours" className="text-sm font-medium text-gray-700">
                Estimated Hours
              </Label>
              <Input
                id="estimatedHours"
                type="number"
                value={project.estimatedHours}
                onChange={(e) => setProject({ ...project, estimatedHours: Number.parseInt(e.target.value) || 0 })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <Checkbox
                id="rush"
                checked={project.rush}
                onCheckedChange={(checked) => setProject({ ...project, rush: checked as boolean })}
              />
              <Label htmlFor="rush" className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                Rush Order (Priority Processing)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                Special Instructions
              </Label>
              <Textarea
                id="instructions"
                value={project.instructions}
                onChange={(e) => setProject({ ...project, instructions: e.target.value })}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <CardTitle className="text-lg text-gray-900">Assignment Details</CardTitle>
            <CardDescription>Customer and tailor information</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Customer</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/frequency-modulation-spectrum.png" alt={project.customerName} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {project.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{project.customerName}</div>
                      <div className="text-sm text-gray-600">Customer ID: {project.customerId}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Assigned Tailor</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/stylized-letter-ma.png" alt={project.tailorName} />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {project.tailorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{project.tailorName}</div>
                      <div className="text-sm text-gray-600">Tailor ID: {project.tailorId}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Related Order</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <div className="font-medium text-gray-900">Order #{project.orderId}</div>
                  <div className="text-sm text-gray-600">View order details</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Management */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-gray-900">Workflow Steps</CardTitle>
              <CardDescription>Manage the project workflow and track progress</CardDescription>
            </div>
            <Dialog open={isAddWorkflowOpen} onOpenChange={setIsAddWorkflowOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Workflow Step</DialogTitle>
                  <DialogDescription>Add a new step to the project workflow</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Workflow Template</Label>
                    <Select
                      value={selectedTemplate?.toString()}
                      onValueChange={(value) => setSelectedTemplate(Number.parseInt(value))}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select a workflow template" />
                      </SelectTrigger>
                      <SelectContent>
                        {workflowTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            <div>
                              <div className="font-medium">{template.title}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workflow-notes" className="text-sm font-medium text-gray-700">
                      Initial Notes
                    </Label>
                    <Textarea
                      id="workflow-notes"
                      placeholder="Add any initial notes for this workflow step..."
                      value={newWorkflowNotes}
                      onChange={(e) => setNewWorkflowNotes(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddWorkflowOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddWorkflow}
                    disabled={!selectedTemplate}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Step
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Step</TableHead>
                <TableHead className="font-semibold text-gray-900">Workflow</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Notes</TableHead>
                <TableHead className="font-semibold text-gray-900">Completed</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.workflows.map((workflow) => (
                <TableRow key={workflow.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Badge variant="outline" className="border-blue-200 text-blue-800">
                      Step {workflow.stepNo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{workflow.config.title}</div>
                      <div className="text-sm text-gray-500">{workflow.config.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {workflow.status === "completed" ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingWorkflow === workflow.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={workflowNotes}
                          onChange={(e) => setWorkflowNotes(e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateWorkflowNotes(workflow.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingWorkflow(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-700">{workflow.notes || "No notes added"}</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingWorkflow(workflow.id)
                            setWorkflowNotes(workflow.notes)
                          }}
                          className="mt-1 h-6 px-2 text-xs"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {workflow.completedAt ? (
                      <div className="text-sm text-gray-600">{format(workflow.completedAt, "MMM dd, yyyy")}</div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
