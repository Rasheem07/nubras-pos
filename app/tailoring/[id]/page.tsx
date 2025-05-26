"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Edit,
  Save,
  TrendingUp,
  Target,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface WorkflowStep {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt?: Date
  estimatedHours: number
  actualHours?: number
  notes?: string
}

interface ProjectDetails {
  id: string
  customer: {
    name: string
    initials: string
    image?: string
    phone: string
    email: string
  }
  description: string
  category: string
  deadline: string
  status: "pending" | "in-progress" | "completed" | "delayed"
  progress: number
  tailor: {
    name: string
    initials: string
    image?: string
    level: number
  }
  isRush: boolean
  createdAt: string
  workflow: WorkflowStep[]
  totalEstimatedHours: number
  totalActualHours: number
}

const projectData: ProjectDetails = {
  id: "TP-001",
  customer: {
    name: "Fatima Mohammed",
    initials: "FM",
    image: "/frequency-modulation-spectrum.png",
    phone: "+971 50 123 4567",
    email: "fatima@email.com",
  },
  description: "2 Custom Kanduras with Traditional Embroidery",
  category: "Kandura",
  deadline: "May 10, 2024",
  status: "in-progress",
  progress: 60,
  tailor: {
    name: "Mohammed Ali",
    initials: "MA",
    image: "/stylized-letter-ma.png",
    level: 3,
  },
  isRush: true,
  createdAt: "May 2, 2024",
  totalEstimatedHours: 24,
  totalActualHours: 14,
  workflow: [
    {
      id: "step1",
      title: "Measurements & Design Consultation",
      description: "Take precise customer measurements and finalize design specifications",
      completed: true,
      completedAt: new Date("2024-05-02T10:00:00"),
      estimatedHours: 2,
      actualHours: 1.5,
      notes: "Customer requested slight modification to collar design for traditional look",
    },
    {
      id: "step2",
      title: "Fabric Selection & Material Preparation",
      description: "Select appropriate fabric and prepare materials according to specifications",
      completed: true,
      completedAt: new Date("2024-05-03T14:30:00"),
      estimatedHours: 4,
      actualHours: 3.5,
      notes: "Used premium cotton fabric as requested by customer",
    },
    {
      id: "step3",
      title: "Pattern Creation & Cutting",
      description: "Create patterns and cut fabric pieces according to measurements",
      completed: true,
      completedAt: new Date("2024-05-04T16:00:00"),
      estimatedHours: 6,
      actualHours: 5,
    },
    {
      id: "step4",
      title: "Traditional Embroidery Work",
      description: "Apply traditional embroidery patterns on collar and cuffs",
      completed: true,
      completedAt: new Date("2024-05-05T18:00:00"),
      estimatedHours: 8,
      actualHours: 4,
      notes: "Embroidery completed faster than expected due to simpler pattern choice",
    },
    {
      id: "step5",
      title: "First Fitting Appointment",
      description: "Customer fitting session and initial adjustments",
      completed: false,
      estimatedHours: 1,
    },
    {
      id: "step6",
      title: "Final Adjustments & Refinements",
      description: "Make necessary adjustments based on fitting feedback",
      completed: false,
      estimatedHours: 2,
    },
    {
      id: "step7",
      title: "Quality Inspection & Finishing",
      description: "Final quality check, pressing, and finishing touches",
      completed: false,
      estimatedHours: 1,
    },
  ],
}

export default function TailoringProjectDetail() {
  const [project, setProject] = useState<ProjectDetails>(projectData)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [stepNotes, setStepNotes] = useState("")

  const handleStepToggle = (stepId: string) => {
    setProject((prev) => {
      const updatedWorkflow = prev.workflow.map((step) => {
        if (step.id === stepId) {
          const isCompleting = !step.completed
          return {
            ...step,
            completed: isCompleting,
            completedAt: isCompleting ? new Date() : undefined,
            actualHours: isCompleting ? step.estimatedHours : undefined,
          }
        }
        return step
      })

      const completedSteps = updatedWorkflow.filter((step) => step.completed).length
      const totalSteps = updatedWorkflow.length
      const newProgress = Math.round((completedSteps / totalSteps) * 100)

      let newStatus = prev.status
      if (newProgress === 100) {
        newStatus = "completed"
      } else if (newProgress > 0) {
        newStatus = "in-progress"
      } else {
        newStatus = "pending"
      }

      return {
        ...prev,
        workflow: updatedWorkflow,
        progress: newProgress,
        status: newStatus,
        totalActualHours: updatedWorkflow.reduce((total, step) => total + (step.actualHours || 0), 0),
      }
    })
  }

  const handleSaveNotes = (stepId: string) => {
    setProject((prev) => ({
      ...prev,
      workflow: prev.workflow.map((step) => (step.id === stepId ? { ...step, notes: stepNotes } : step)),
    }))
    setEditingStep(null)
    setStepNotes("")
  }

  const getStatusBadge = (status: ProjectDetails["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case "delayed":
        return <Badge variant="destructive">Delayed</Badge>
    }
  }

  const efficiency =
    project.totalEstimatedHours > 0
      ? Math.round((project.totalEstimatedHours / Math.max(project.totalActualHours, 1)) * 100)
      : 100

  return (
    <div className="flex flex-col gap-8">
      {/* Professional Header */}
      <div className="flex items-center gap-6">
        <Link href="/tailoring">
          <Button variant="outline" size="icon" className="border-gray-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.id}</h1>
            {project.isRush && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex gap-1 items-center">
                <AlertTriangle className="h-3 w-3" />
                Rush Order
              </Badge>
            )}
            {getStatusBadge(project.status)}
          </div>
          <p className="text-gray-600 text-lg">{project.description}</p>
        </div>
        <Button variant="outline" className="border-gray-300">
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-gray-900">{project.progress}%</p>
                <Progress value={project.progress} className="h-2 mt-2" />
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Efficiency</p>
                <p className="text-3xl font-bold text-gray-900">{efficiency}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {project.totalActualHours}h / {project.totalEstimatedHours}h
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Steps Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {project.workflow.filter((step) => step.completed).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">of {project.workflow.length} total</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Remaining</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-xs text-gray-500 mt-1">until {project.deadline}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer and Tailor Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <CardTitle className="text-lg text-gray-900">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={project.customer.image || "/placeholder.svg"} alt={project.customer.name} />
                <AvatarFallback className="bg-gray-200 text-gray-700">{project.customer.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900 text-lg">{project.customer.name}</div>
                <div className="text-sm text-gray-600">{project.customer.phone}</div>
                <div className="text-sm text-gray-600">{project.customer.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <CardTitle className="text-lg text-gray-900">Assigned Tailor</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={project.tailor.image || "/placeholder.svg"} alt={project.tailor.name} />
                <AvatarFallback className="bg-gray-200 text-gray-700">{project.tailor.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900 text-lg">{project.tailor.name}</div>
                <div className="text-sm text-gray-600">Level {project.tailor.level} Master Tailor</div>
                <div className="text-sm text-gray-600">Specializes in Traditional Wear</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Tabs */}
      <Card className="border-gray-200 shadow-sm">
        <Tabs defaultValue="workflow" className="w-full">
          <div className="border-b border-gray-200 px-6">
            <TabsList className="bg-transparent border-none p-0 h-auto">
              <TabsTrigger
                value="workflow"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Workflow Progress
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Project Details
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                Activity History
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="workflow" className="mt-0 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Workflow</h3>
                <p className="text-gray-600 mb-6">Track progress through each step of the tailoring process</p>
              </div>

              <div className="space-y-6">
                {project.workflow.map((step, index) => (
                  <div key={step.id} className="flex gap-6 p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col items-center">
                      <Checkbox
                        checked={step.completed}
                        onCheckedChange={() => handleStepToggle(step.id)}
                        className="mt-1"
                      />
                      {index < project.workflow.length - 1 && <div className="w-px h-20 bg-gray-200 mt-4" />}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold text-lg ${step.completed ? "text-green-700" : "text-gray-900"}`}>
                          {step.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {step.actualHours ? `${step.actualHours}h` : `~${step.estimatedHours}h`}
                          </div>
                          {step.completed && step.completedAt && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Completed {format(step.completedAt, "MMM d, HH:mm")}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600">{step.description}</p>

                      {step.notes && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-900 text-sm">Notes:</p>
                              <p className="text-blue-800 text-sm">{step.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {editingStep === step.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={stepNotes}
                            onChange={(e) => setStepNotes(e.target.value)}
                            placeholder="Add notes for this step..."
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveNotes(step.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Save className="mr-1 h-3 w-3" />
                              Save Notes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingStep(null)}
                              className="border-gray-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingStep(step.id)
                            setStepNotes(step.notes || "")
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {step.notes ? "Edit Notes" : "Add Notes"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="text-lg text-gray-900">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Category</Label>
                        <div className="font-medium text-gray-900 mt-1">{project.category}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Created Date</Label>
                        <div className="font-medium text-gray-900 mt-1">{project.createdAt}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Delivery Deadline</Label>
                        <div className="font-medium text-gray-900 mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {project.deadline}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Priority Level</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {project.isRush ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              Rush Order
                            </span>
                          ) : (
                            "Standard Priority"
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="text-lg text-gray-900">Time Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Estimated Hours</span>
                        <span className="font-medium text-gray-900">{project.totalEstimatedHours}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Actual Hours</span>
                        <span className="font-medium text-gray-900">{project.totalActualHours}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Remaining Hours</span>
                        <span className="font-medium text-gray-900">
                          {Math.max(0, project.totalEstimatedHours - project.totalActualHours)}h
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Time Efficiency</span>
                          <Badge
                            className={
                              efficiency >= 90
                                ? "bg-green-100 text-green-800 border-green-200"
                                : efficiency >= 80
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {efficiency}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Activity Timeline</h3>
                <p className="text-gray-600 mb-6">Complete history of project activities and milestones</p>
              </div>

              <div className="space-y-4">
                {project.workflow
                  .filter((step) => step.completed && step.completedAt)
                  .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                  .map((step) => (
                    <div key={step.id} className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-lg">{step.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Completed on {format(step.completedAt!, "EEEE, MMMM do, yyyy 'at' HH:mm")}
                        </div>
                        {step.notes && (
                          <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded border">
                            <strong>Notes:</strong> {step.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {step.actualHours}h
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
