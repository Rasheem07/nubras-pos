"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Settings, Workflow } from "lucide-react"
import { format } from "date-fns"

interface WorkflowTemplate {
  id: number
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  usageCount?: number
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 1,
    title: "Measurements & Design Consultation",
    description: "Take precise customer measurements and finalize design specifications",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    usageCount: 45,
  },
  {
    id: 2,
    title: "Fabric Selection & Material Preparation",
    description: "Select appropriate fabric and prepare materials according to specifications",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    usageCount: 42,
  },
  {
    id: 3,
    title: "Pattern Creation & Cutting",
    description: "Create patterns and cut fabric pieces according to measurements",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    usageCount: 38,
  },
  {
    id: 4,
    title: "Traditional Embroidery Work",
    description: "Apply traditional embroidery patterns on collar and cuffs",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-25"),
    usageCount: 28,
  },
  {
    id: 5,
    title: "First Fitting Appointment",
    description: "Customer fitting session and initial adjustments",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    usageCount: 35,
  },
  {
    id: 6,
    title: "Final Adjustments & Refinements",
    description: "Make necessary adjustments based on fitting feedback",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    usageCount: 33,
  },
  {
    id: 7,
    title: "Quality Inspection & Finishing",
    description: "Final quality check, pressing, and finishing touches",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    usageCount: 40,
  },
  {
    id: 8,
    title: "Custom Beadwork Application",
    description: "Apply custom beadwork and decorative elements",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    usageCount: 12,
  },
]

export default function WorkflowTemplatesPage() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(workflowTemplates)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    description: "",
  })

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateTemplate = () => {
    if (newTemplate.title && newTemplate.description) {
      const template: WorkflowTemplate = {
        id: Math.max(...templates.map((t) => t.id)) + 1,
        title: newTemplate.title,
        description: newTemplate.description,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      }
      setTemplates([...templates, template])
      setNewTemplate({ title: "", description: "" })
      setIsCreateModalOpen(false)
    }
  }

  const handleEditTemplate = () => {
    if (editingTemplate && editingTemplate.title && editingTemplate.description) {
      setTemplates(
        templates.map((t) => (t.id === editingTemplate.id ? { ...editingTemplate, updatedAt: new Date() } : t)),
      )
      setEditingTemplate(null)
      setIsEditModalOpen(false)
    }
  }

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  const openEditModal = (template: WorkflowTemplate) => {
    setEditingTemplate({ ...template })
    setIsEditModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-8 md:p-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Workflow Templates</h1>
          <p className="text-gray-600 mt-1">Manage reusable workflow steps for tailoring projects</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-blue-600" />
                Create Workflow Template
              </DialogTitle>
              <DialogDescription>
                Create a new reusable workflow step that can be used across multiple tailoring projects.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Step Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Measurements & Design Consultation"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of what this workflow step involves..."
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                disabled={!newTemplate.title || !newTemplate.description}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-3xl font-bold text-gray-900">{templates.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...templates.map((t) => t.usageCount || 0))} times
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Steps/Project</p>
                <p className="text-3xl font-bold text-gray-900">6.2</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Workflow className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-gray-900">Workflow Templates</CardTitle>
              <CardDescription className="text-gray-600">
                Manage and organize your reusable workflow steps
              </CardDescription>
            </div>
            <div className="w-80">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">Template</TableHead>
                  <TableHead className="font-semibold text-gray-900">Description</TableHead>
                  <TableHead className="font-semibold text-gray-900">Usage Count</TableHead>
                  <TableHead className="font-semibold text-gray-900">Created</TableHead>
                  <TableHead className="font-semibold text-gray-900">Last Updated</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-gray-900">{template.title}</div>
                      <div className="text-sm text-gray-500">ID: {template.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md text-gray-700 text-sm">
                        {template.description.length > 100
                          ? `${template.description.substring(0, 100)}...`
                          : template.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                        {template.usageCount || 0} projects
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {format(template.createdAt, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {format(template.updatedAt, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditModal(template)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Workflow Template
            </DialogTitle>
            <DialogDescription>Update the workflow template details.</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
                  Step Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditTemplate}
              disabled={!editingTemplate?.title || !editingTemplate?.description}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
