"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
  User,
  Scissors,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type WorkflowConfig = {
  id: number;
  title: string;
  description: string;
  created_at: string; // ISO date string
  updated_at: string | null;
};

type WorkflowStep = {
  id: number;
  stepNo: number;
  notes: string;
  status: "pending" | "in_progress" | "completed" | string;
  estimatedHours: number;
  actualHours: number;
  completedAt: string | null;
  config: WorkflowConfig;
};

type ProjectDetails = {
  id: number;
  orderId: number;
  customerId: number;
  description: string;
  deadline: string; // ISO date string
  rush: boolean;
  instructions: string;
  estimatedHours: number | null;
  actualHours: string;
  status: "pending" | "in_progress" | "completed" | string;
  tailorId: number;
  createdAt: string;
  updatedAt: string | null;
  customerName: string;
  tailorName: string;
  daysRemaining: number;
  stepsCompleted: string;
  totalSteps: string;
  timeEfficiency: string;
  customItems: Array<{
    id: number;
    description: string;
    modelName: string;
    sku: string;
    price: string;
    modelPrice: string;
    total: string;
    measurement: {
      frontLength: string;
      backLength: string;
      shoulder: string;
      sleeves: string;
      neck: string;
      waist: string;
      chest: string;
      widthEnd: string;
      notes: string;
    } | null;
  }>;
  workflows: WorkflowStep[];
};

// Loading skeleton components
const MetricCardSkeleton = () => (
  <Card className="border-gray-200 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-2 w-full" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

const InfoCardSkeleton = () => (
  <Card className="border-gray-200 shadow-sm">
    <CardHeader className="border-b border-gray-200 bg-gray-50/50">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const WorkflowStepSkeleton = () => (
  <div className="flex gap-6 p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-col items-center">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="w-px h-20 mt-4" />
    </div>
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

export default function TailoringProjectDetail() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useQuery<ProjectDetails>({
    queryKey: ["tailoring-project", id],
    queryFn: async () => {
      const response = await fetch(
        `https://api.alnubras.co/api/v1/tailoring/${id}`,
        {  credentials: "include", }
      );
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || `Failed to load project #${id}`);
      }
      return json;
    },
    enabled: !!id,
  });

  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [stepNotes, setStepNotes] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [stepToComplete, setStepToComplete] = useState<number | null>(null);

  const handleStepToggleRequest = (stepId: number) => {
    if (!project) return;

    const step = project.workflows.find((s) => s.id === stepId);
    if (!step) return;

    // If step is already completed, don't allow toggling back
    if (step.status === "completed") {
      toast.info("Completed steps cannot be modified");
      return;
    }

    // Open confirmation dialog for completing a step
    setStepToComplete(stepId);
    setConfirmDialogOpen(true);
  };

  const handleStepToggleConfirm = async () => {
    if (!project || stepToComplete === null) return;

    try {
      const response = await fetch(
        `https://api.alnubras.co/api/v1/tailoring/workflow/${stepToComplete}`,
        {
          method: "PATCH",
           credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update workflow step");
      }

      toast.success(json.message || "Step completed successfully");
      setConfirmDialogOpen(false);
      setStepToComplete(null);

      // Refetch project data
      refetch();
    } catch (error: any) {
      console.error("Error updating step:", error);
      toast.error(error.message || "Failed to update step status");
      setConfirmDialogOpen(false);
      setStepToComplete(null);
    }
  };

  const handleSaveNotes = async (stepId: number) => {
    if (!project) return;

    try {
      // Use the new API endpoint for notes
      const response = await fetch(
        `https://api.alnubras.co/api/v1/tailoring/notes/${stepId}`,
        {
          method: "PATCH",
           credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: stepNotes,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update notes");
      }

      toast.success(json.message || "Notes updated successfully");
      setEditingStep(null);
      setStepNotes("");

      // Refetch project data
      refetch();
    } catch (error: any) {
      console.error("Error updating notes:", error);
      toast.error(error.message || "Failed to update notes");
    }
  };

  const getStatusBadge = (status: ProjectDetails["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        );
      case "on_hold":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            On Hold
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getWorkflowStatusBadge = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        );
      case "on_hold":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            On Hold
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-4 md:p-6">
        <div className="text-red-600 text-lg font-medium">
          Failed to load project
        </div>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
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

        {/* Metrics Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>

        {/* Info Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <InfoCardSkeleton />
          <InfoCardSkeleton />
        </div>

        {/* Tabs Skeleton */}
        <Card className="border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6">
            <div className="flex gap-6 py-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-36" />
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-6">
              <WorkflowStepSkeleton />
              <WorkflowStepSkeleton />
              <WorkflowStepSkeleton />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-gray-600 text-lg font-medium">
          Project not found
        </div>
        <Link href="/tailoring">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  // Calculate progress from API data
  const completedSteps = Number.parseInt(project.stepsCompleted);
  const totalSteps = Number.parseInt(project.totalSteps);
  const progress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Parse numeric values from string fields
  const timeEfficiency = Number.parseFloat(project.timeEfficiency);
  const actualHours = Number.parseFloat(project.actualHours);

  // Calculate total estimated and actual hours from workflows
  const totalEstimatedHours = project.workflows.reduce(
    (sum, step) => sum + step.estimatedHours,
    0
  );
  const totalActualHours = project.workflows.reduce(
    (sum, step) => sum + step.actualHours,
    0
  );

  // Find the step to complete (for confirmation dialog)
  const stepToConfirm =
    stepToComplete !== null
      ? project.workflows.find((step) => step.id === stepToComplete)
      : null;

  return (
    <div className="flex flex-col gap-8 P-4 md:p-6">
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Workflow Step</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this step as completed? This action
              cannot be undone.
              {stepToConfirm && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="font-medium text-blue-900">
                    Step {stepToConfirm.stepNo}: {stepToConfirm.config.title}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setStepToComplete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleStepToggleConfirm}
            >
              Complete Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Professional Header */}
      <div className="flex items-center gap-6">
        <Link href="/tailoring">
          <Button variant="outline" size="icon" className="border-gray-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Project #{project.id}
            </h1>
            {project.rush && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 flex gap-1 items-center">
                <AlertTriangle className="h-3 w-3" />
                Rush Order
              </Badge>
            )}
            {getStatusBadge(project.status)}
          </div>
          <p className="text-gray-600 text-lg">{project.description}</p>
        </div>
        <Button variant="outline" className="border-gray-300" asChild>
          <Link href={`/tailoring/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Link>
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-3xl font-bold text-gray-900">{progress}%</p>
                <Progress value={progress} className="h-2 mt-2" />
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
                <p className="text-sm font-medium text-gray-600">
                  Time Efficiency
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {timeEfficiency.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {actualHours}h / {project.estimatedHours || 0}h
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
                <p className="text-sm font-medium text-gray-600">
                  Steps Completed
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {project.stepsCompleted}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {project.totalSteps} total
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Days Remaining
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {project.daysRemaining}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  until {format(new Date(project.deadline), "MMM d, yyyy")}
                </p>
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
                <div className="font-medium text-gray-900 text-lg">
                  {project.customerName}
                </div>
                <div className="text-sm text-gray-500">
                  Customer ID: {project.customerId}
                </div>
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
                <div className="font-medium text-gray-900 text-lg">
                  {project.tailorName}
                </div>
                <div className="text-sm text-gray-500">
                  Tailor ID: {project.tailorId}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Tabs */}
      <Card className="border-gray-200 shadow-sm">
        <Tabs defaultValue="items" className="w-full">
          <div className="border-b border-gray-200 px-6">
            <TabsList className="bg-transparent border-none p-0 h-auto">
              <TabsTrigger
                value="items"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                items
              </TabsTrigger>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Project Workflow
                </h3>
                <p className="text-gray-600 mb-6">
                  Track progress through each step of the tailoring process
                </p>
              </div>

              <div className="space-y-6">
                {project.workflows
                  .sort((a, b) => a.stepNo - b.stepNo)
                  .map((step, index) => (
                    <div
                      key={step.id}
                      className="flex gap-6 p-6 rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="flex flex-col items-center">
                        <Checkbox
                          checked={step.status === "completed"}
                          onCheckedChange={() =>
                            handleStepToggleRequest(step.id)
                          }
                          disabled={step.status === "completed"}
                          className={`mt-1 ${step.status === "completed" ? "opacity-60 cursor-not-allowed" : ""}`}
                        />
                        {index < project.workflows.length - 1 && (
                          <div className="w-px h-20 bg-gray-200 mt-4" />
                        )}
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-semibold text-lg ${
                              step.status === "completed"
                                ? "text-green-700"
                                : "text-gray-900"
                            }`}
                          >
                            Step {step.stepNo}: {step.config.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span className="text-xs">
                                {step.actualHours}h / {step.estimatedHours}h
                              </span>
                            </div>
                            {getWorkflowStatusBadge(step.status)}
                            {step.status === "completed" &&
                              step.completedAt && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  Completed{" "}
                                  {format(
                                    new Date(step.completedAt),
                                    "MMM d, HH:mm"
                                  )}
                                </Badge>
                              )}
                          </div>
                        </div>

                        <p className="text-gray-600">
                          {step.config.description}
                        </p>

                        {step.notes && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-900 text-sm">
                                  Notes:
                                </p>
                                <p className="text-blue-800 text-sm">
                                  {step.notes}
                                </p>
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
                              setEditingStep(step.id);
                              setStepNotes(step.notes || "");
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
                    <CardTitle className="text-lg text-gray-900">
                      Project Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Order ID
                        </Label>
                        <div className="font-medium text-gray-900 mt-1">
                          #{project.orderId}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Created Date
                        </Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {format(
                            new Date(project.createdAt),
                            "EEEE, MMMM do, yyyy"
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Delivery Deadline
                        </Label>
                        <div className="font-medium text-gray-900 mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {format(
                            new Date(project.deadline),
                            "EEEE, MMMM do, yyyy"
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Priority Level
                        </Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {project.rush ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              Rush Order
                            </span>
                          ) : (
                            "Standard Priority"
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Special Instructions
                        </Label>
                        <div className="font-medium text-gray-900 mt-1 p-3 bg-gray-50 rounded border">
                          {project.instructions}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="text-lg text-gray-900">
                      Time Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Project Estimated Hours
                        </span>
                        <span className="font-medium text-gray-900">
                          {project.estimatedHours
                            ? `${project.estimatedHours}h`
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Project Actual Hours
                        </span>
                        <span className="font-medium text-gray-900">
                          {actualHours}h
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Workflow Total Estimated
                        </span>
                        <span className="font-medium text-gray-900">
                          {totalEstimatedHours}h
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Workflow Total Actual
                        </span>
                        <span className="font-medium text-gray-900">
                          {totalActualHours}h
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Remaining Hours
                        </span>
                        <span className="font-medium text-gray-900">
                          {Math.max(0, totalEstimatedHours - totalActualHours)}h
                        </span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Time Efficiency
                          </span>
                          <Badge
                            className={
                              timeEfficiency >= 90
                                ? "bg-green-100 text-green-800 border-green-200"
                                : timeEfficiency >= 80
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                            }
                          >
                            {timeEfficiency.toFixed(1)}%
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Activity Timeline
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete history of project activities and milestones
                </p>
              </div>

              <div className="space-y-4">
                {project.workflows
                  .filter(
                    (step) => step.status === "completed" && step.completedAt
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.completedAt!).getTime() -
                      new Date(a.completedAt!).getTime()
                  )
                  .map((step) => (
                    <div
                      key={step.id}
                      className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-lg">
                          Step {step.stepNo}: {step.config.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Completed on{" "}
                          {format(
                            new Date(step.completedAt!),
                            "EEEE, MMMM do, yyyy 'at' HH:mm"
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Time: {step.actualHours}h (estimated:{" "}
                          {step.estimatedHours}h)
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

                {project.workflows.filter((step) => step.status === "completed")
                  .length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No completed activities yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="items" className="mt-0 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tailoring Items
                </h3>
                <p className="text-gray-600 mb-6">
                  Detailed breakdown of all custom tailoring items and their
                  measurements
                </p>
              </div>

              <div className="grid gap-6">
                {project.customItems.map((item, index) => (
                  <Card key={item.id} className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                      <CardTitle className="flex items-center justify-between text-lg text-gray-900">
                        <span>
                          #{index + 1} — {item.description}
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {item.modelName}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                        <div>
                          <strong>SKU:</strong> {item.sku}
                        </div>
                        <div>
                          <strong>Base Price:</strong> AED {item.price}
                        </div>
                        <div>
                          <strong>Model Price:</strong> AED {item.modelPrice}
                        </div>
                        <div>
                          <strong>Total:</strong> AED {item.total}
                        </div>
                      </div>

                      {item.measurement && (
                        <div className="mt-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-2">
                            Measurements
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
                            <div>
                              <strong>Front:</strong>{" "}
                              {item.measurement.frontLength}"
                            </div>
                            <div>
                              <strong>Back:</strong>{" "}
                              {item.measurement.backLength}"
                            </div>
                            <div>
                              <strong>Shoulder:</strong>{" "}
                              {item.measurement.shoulder}"
                            </div>
                            <div>
                              <strong>Sleeves:</strong>{" "}
                              {item.measurement.sleeves}"
                            </div>
                            <div>
                              <strong>Neck:</strong> {item.measurement.neck}"
                            </div>
                            <div>
                              <strong>Waist:</strong> {item.measurement.waist}"
                            </div>
                            <div>
                              <strong>Chest:</strong> {item.measurement.chest}"
                            </div>
                            <div>
                              <strong>Width End:</strong>{" "}
                              {item.measurement.widthEnd}"
                            </div>
                          </div>
                          {item.measurement.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded border text-gray-700">
                              <strong>Notes:</strong> {item.measurement.notes}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
