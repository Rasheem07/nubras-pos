"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  CalendarIcon,
  Search,
  Scissors,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShoppingBag,
  Plus,
  Trash2,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import TailoringOrdersTableSkeleton from "./tableLoading";

interface Tailor {
  id: string;
  name: string;
  image?: string;
  level: number;
  specialties: string[];
  workload: number;
  status: string;
  performance: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

type TailoringOrder = {
  id: number;
  date: string;
  totalAmount: string;
  priority: "low" | "medium" | "high";
  status: "draft" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    preferences?: string[];
  };
  items: {
    id: number;
    name: string;
    type: "custom" | "alteration" | "service";
    qty: number;
  }[];
};

interface WorkflowConfig {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateProjectWorkflow {
  stepNo: number;
  configId: number;
  notes: string;
  estimatedHours: number;
}

interface CreateTailoringDto {
  orderId: number;
  customerId: number;
  description: string;
  deadline: Date;
  rush: boolean;
  instructions: string;
  tailorId: number;
  workflows: CreateProjectWorkflow[];
}

export default function NewTailoringProject() {
  const [activeTab, setActiveTab] = useState("order");
  const [selectedTailor, setSelectedTailor] = useState<Tailor | null>(null);
  const [searchTailor, setSearchTailor] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchOrder, setSearchOrder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateTailoringDto>({
    defaultValues: {
      rush: false,
      workflows: [{ stepNo: 1, configId: 0, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workflows",
  });

  const watchedValues = watch();

  const { data: orders = [], isLoading: isOrdersLoading } = useQuery<
    TailoringOrder[]
  >({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch(
        "http://3.29.240.212/api/v1/sales/list/tailoring"
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to load orders!");
      }
      return json;
    },
  });

  const { data: tailors = [], isLoading: tailorLoading } = useQuery<Tailor[]>({
    queryKey: ["tailors"],
    queryFn: async () => {
      const response = await fetch(
        "http://3.29.240.212/api/v1/staff/list/tailors"
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to load tailors list!");
      }
      return json;
    },
  });

  const { data: workflowConfigs = [] } = useQuery<WorkflowConfig[]>({
    queryKey: ["workflow-configs"],
    queryFn: async () => {
      const response = await fetch(
        "http://3.29.240.212/api/v1/tailoring/workflow/templates"
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to load workflow templates!");
      }
      return json;
    },
  });

  const filteredTailors =
    tailors.length > 0
      ? tailors.filter(
          (tailor: Tailor) =>
            tailor.name.toLowerCase().includes(searchTailor.toLowerCase()) ||
            tailor.specialties.some((specialty) =>
              specialty.toLowerCase().includes(searchTailor.toLowerCase())
            )
        )
      : [];

  const filteredOrders = orders.filter(
    (order: TailoringOrder) =>
      order.customer.name.toLowerCase().includes(searchOrder.toLowerCase()) ||
      String(order.id).toLowerCase().includes(searchOrder.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            New
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Normal
          </Badge>
        );
      case "overloaded":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Overloaded
          </Badge>
        );
      case "excellent":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Excellent
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Not defined
          </Badge>
        );
    }
  };

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 90) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Excellent
        </Badge>
      );
    } else if (efficiency >= 80) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Good
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          Average
        </Badge>
      );
    }
  };

  const handleOrderSelection = (order: any) => {
    setSelectedOrder(order);
    setValue("orderId", order.id);
    setValue("customerId", order.customer.id);
  };

  const handleTailorSelection = (tailor: Tailor) => {
    setSelectedTailor(tailor);
    setValue("tailorId", Number.parseInt(tailor.id));
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Confirmed
          </Badge>
        );
      case "pending_tailoring":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending Tailoring
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            High Priority
          </Badge>
        );
      case "normal":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const addWorkflowStep = () => {
    append({
      stepNo: fields.length + 1,
      configId: 0,
      notes: "",
      estimatedHours: 0
    });
  };

  const removeWorkflowStep = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Update step numbers
      fields.forEach((_, idx) => {
        if (idx > index) {
          setValue(`workflows.${idx - 1}.stepNo`, idx);
        }
      });
    }
  };

  const onSubmit = async (data: CreateTailoringDto) => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!data.orderId || !data.customerId || !data.tailorId) {
        toast.error("Please complete all required selections");
        return;
      }

      if (!data.description.trim()) {
        toast.error("Project description is required");
        return;
      }

      if (!data.instructions.trim()) {
        toast.error("Instructions are required");
        return;
      }

      if (data.workflows.length === 0) {
        toast.error("At least one workflow step is required");
        return;
      }

      // Validate workflows
      for (const workflow of data.workflows) {
        if (!workflow.configId || workflow.configId === 0) {
          toast.error("Please select a configuration for all workflow steps");
          return;
        }
        if (!workflow.notes.trim()) {
          toast.error("Notes are required for all workflow steps");
          return;
        }
      }

      const response = await fetch("http://3.29.240.212/api/v1/tailoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create tailoring project"
        );
      }

      const result = await response.json();
      toast.success("Tailoring project created successfully!");

      // Reset form and redirect
      reset();
      setSelectedOrder(null);
      setSelectedTailor(null);
      setActiveTab("order");
    } catch (error) {
      console.error("Error creating tailoring project:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = selectedOrder && selectedTailor && watchedValues.deadline;

  return (
    <div className="flex flex-col gap-8">
      {/* Professional Header */}
      <div className="flex items-center gap-6">
        <Link href="/tailoring">
          <Button variant="outline" size="icon" className="border-gray-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create New Project
          </h1>
          <p className="text-gray-600 mt-1">
            Set up a new tailoring project with customer and tailor assignment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Professional Tab Navigation */}
        <Card className="border-gray-200 shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent border-none p-0 h-auto">
              <TabsTrigger
                value="order"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      activeTab === "order"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    1
                  </div>
                  Select Order
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="details"
                disabled={!selectedOrder}
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      activeTab === "details"
                        ? "bg-blue-600 text-white"
                        : selectedOrder
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {selectedOrder ? <CheckCircle2 className="h-3 w-3" /> : "2"}
                  </div>
                  Project Details
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="workflows"
                disabled={!selectedOrder}
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      activeTab === "workflows"
                        ? "bg-blue-600 text-white"
                        : watchedValues.description &&
                            watchedValues.instructions
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {watchedValues.description && watchedValues.instructions ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      "3"
                    )}
                  </div>
                  Workflows
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="tailor"
                disabled={!selectedOrder}
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      activeTab === "tailor"
                        ? "bg-blue-600 text-white"
                        : selectedTailor
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {selectedTailor ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      "4"
                    )}
                  </div>
                  Tailor Assignment
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="review"
                disabled={!canProceed}
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      activeTab === "review"
                        ? "bg-blue-600 text-white"
                        : canProceed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {canProceed ? <CheckCircle2 className="h-3 w-3" /> : "5"}
                  </div>
                  Review & Create
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              <TabsContent value="order" className="mt-0 space-y-8">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                      Select Order for Tailoring
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Choose an existing order that requires tailoring work
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search orders by invoice number, customer name, or order ID..."
                        value={searchOrder}
                        onChange={(e) => setSearchOrder(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      {isOrdersLoading ? (
                        <TailoringOrdersTableSkeleton />
                      ) : (
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="font-semibold text-gray-900">
                                Order Details
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                Customer
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                Items Requiring Tailoring
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                Total Value
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                Priority
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                Status
                              </TableHead>
                              <TableHead className="font-semibold text-gray-900">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders.map((order: TailoringOrder) => (
                              <TableRow
                                key={order.id}
                                className={cn(
                                  "hover:bg-gray-50 transition-colors",
                                  selectedOrder?.id === order.id &&
                                    "bg-blue-50 border-l-4 border-l-blue-500"
                                )}
                              >
                                <TableCell>
                                  <div>
                                    <div className="text-base text-primary hover:text-blue-600 underline underline-offset-2 ">
                                      <Link href={`/sales/${order.id}`}>
                                        INV-{String(order.id).padStart(3, "0")}
                                      </Link>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {format(order.date, "MMM dd, yyyy")}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {order.customer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {order.customer.phone}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    {order.items.map((item: any) => (
                                      <div key={item.id} className="text-sm">
                                        <span className="font-medium">
                                          {item.name}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="ml-2 text-xs"
                                        >
                                          {item.type}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-gray-900">
                                    AED {order.totalAmount}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {getPriorityBadge(order.priority)}
                                </TableCell>
                                <TableCell>
                                  {getOrderStatusBadge(order.status)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant={
                                      selectedOrder?.id === order.id
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => handleOrderSelection(order)}
                                    className={
                                      selectedOrder?.id === order.id
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : ""
                                    }
                                  >
                                    {selectedOrder?.id === order.id
                                      ? "Selected"
                                      : "Select"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>

                    {selectedOrder && (
                      <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-900">
                            Selected Order Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-blue-700 font-medium">
                                Customer
                              </div>
                              <div className="text-blue-900">
                                {selectedOrder.customer.name}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-blue-700 font-medium">
                                Order Value
                              </div>
                              <div className="text-blue-900">
                                AED {selectedOrder.totalAmount}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    disabled={!selectedOrder}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Next: Project Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0 space-y-8">
                <div className="grid gap-8">
                  <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                      <CardTitle className="text-lg text-gray-900">
                        Project Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Enter the project details and requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {selectedOrder && selectedOrder.customer && (
                        <div className="flex rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                          <div className="flex items-center px-5 py-4 bg-gray-50 border-r border-gray-300 text-gray-700 font-medium text-nowrap">
                            Selected Customer
                          </div>
                          <div className="flex items-center gap-x-5 px-6 py-4 bg-white w-full">
                            <div className="h-12 w-12 flex items-center justify-center bg-blue-600 text-white text-lg font-bold rounded-full shadow">
                              {selectedOrder.customer.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className="flex flex-col justify-center">
                              <h1 className="text-lg font-semibold text-gray-800">
                                {selectedOrder.customer.name}
                              </h1>
                              <span className="text-sm font-mono text-gray-600">
                                {selectedOrder.customer.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
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
                        {errors.description && (
                          <p className="text-sm text-red-600">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Delivery Deadline *
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                !watchedValues.deadline && "text-gray-500"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {watchedValues.deadline
                                ? format(watchedValues.deadline, "PPP")
                                : "Select delivery date"}
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
                        {errors.deadline && (
                          <p className="text-sm text-red-600">
                            {errors.deadline.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <Checkbox
                          id="rush"
                          {...register("rush")}
                          checked={watchedValues.rush}
                          onCheckedChange={(checked) =>
                            setValue("rush", checked === true)
                          }
                        />
                        <Label
                          htmlFor="rush"
                          className="flex items-center gap-2 text-sm font-medium text-amber-800"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Rush Order (Priority Processing)
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="instructions"
                          className="text-sm font-medium text-gray-700"
                        >
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
                        {errors.instructions && (
                          <p className="text-sm text-red-600">
                            {errors.instructions.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("order")}
                    className="border-gray-300"
                  >
                    Back to Order Selection
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("workflows")}
                    disabled={
                      !watchedValues.description || !watchedValues.instructions
                    }
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
                      Configure the workflow steps for this tailoring project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <Card key={field.id} className="border-gray-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                Step {index + 1}
                              </CardTitle>
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
                              {...register(
                                `workflows.${index}.stepNo` as const
                              )}
                              value={index + 1}
                            />

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Workflow Configuration *
                              </Label>
                              <Select
                                value={String(
                                  watchedValues.workflows?.[index]?.configId ||
                                    ""
                                )}
                                onValueChange={(value) =>
                                  setValue(
                                    `workflows.${index}.configId`,
                                    Number.parseInt(value)
                                  )
                                }
                              >
                                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select workflow configuration" />
                                </SelectTrigger>
                                <SelectContent>
                                  {workflowConfigs.map((config) => (
                                    <SelectItem
                                      key={config.id}
                                      value={String(config.id)}
                                    >
                                      <div>
                                        <div className="font-medium">
                                          {config.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {config.description}
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.workflows?.[index]?.configId && (
                                <p className="text-sm text-red-600">
                                  Configuration is required
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Notes *
                              </Label>
                              <Textarea
                                {...register(
                                  `workflows.${index}.notes` as const,
                                  {
                                    required: "Notes are required",
                                    minLength: {
                                      value: 1,
                                      message: "Notes cannot be empty",
                                    },
                                  }
                                )}
                                placeholder="Enter specific notes for this workflow step..."
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={2}
                              />
                              {errors.workflows?.[index]?.notes && (
                                <p className="text-sm text-red-600">
                                  {errors.workflows[index]?.notes?.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="estimatedHours"
                                className="text-sm font-medium text-gray-700"
                              >
                                Estimated Hours 
                              </Label>
                              <Input
                                id="estimatedHours"
                                type="number"
                                min="1"
                                {...register(
                                  `workflows.${index}.estimatedHours`,
                                  {
                                    valueAsNumber: true,
                                    min: {
                                      value: 1,
                                      message:
                                        "Estimated hours must be positive",
                                    },
                                  }
                                )}
                                placeholder="Enter estimated hours for completion"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                              {errors.workflows?.[index]?.estimatedHours && (
                                <p className="text-sm text-red-600">
                                  {
                                    errors.workflows[index]?.estimatedHours
                                      ?.message
                                  }
                                </p>
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
                    type="button"
                    onClick={() => setActiveTab("tailor")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Next: Assign Tailor
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tailor" className="mt-0 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                      <Scissors className="h-5 w-5 text-blue-600" />
                      Tailor Assignment
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Select the most suitable tailor based on expertise and
                      availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tailors by name, specialty, or skill level..."
                        value={searchTailor}
                        onChange={(e) => setSearchTailor(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-semibold text-gray-900">
                              Tailor
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                              Level
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                              Specialties
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                              Workload
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                              Performance
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-gray-900">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTailors.map((tailor) => (
                            <TableRow
                              key={tailor.id}
                              className={cn(
                                "hover:bg-gray-50 transition-colors",
                                selectedTailor?.id === tailor.id &&
                                  "bg-blue-50 border-l-4 border-l-blue-500"
                              )}
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={tailor.image || "/placeholder.svg"}
                                      alt={tailor.name}
                                    />
                                    <AvatarFallback className="bg-gray-200 text-gray-700">
                                      {tailor.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {tailor.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {tailor.id}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge
                                    variant="outline"
                                    className="border-blue-200 text-blue-800"
                                  >
                                    Level {tailor.level}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {tailor.specialties &&
                                    tailor.specialties.map((specialty) => (
                                      <Badge
                                        key={specialty}
                                        variant="secondary"
                                        className="text-xs bg-gray-100 text-gray-700"
                                      >
                                        {specialty}
                                      </Badge>
                                    ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {tailor.workload} active
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {getEfficiencyBadge(tailor.performance)}
                                  <div className="text-xs text-gray-600">
                                    {tailor.performance}% efficiency
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(tailor.status)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant={
                                    selectedTailor?.id === tailor.id
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handleTailorSelection(tailor)}
                                  disabled={tailor.status === "unavailable"}
                                  className={
                                    selectedTailor?.id === tailor.id
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : ""
                                  }
                                >
                                  {selectedTailor?.id === tailor.id
                                    ? "Selected"
                                    : "Select"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("workflows")}
                    className="border-gray-300"
                  >
                    Back to Workflows
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("review")}
                    disabled={!selectedTailor}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Review Project
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="review" className="mt-0 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="text-lg text-gray-900">
                      Project Review
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Review all project details before creation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                      {/* Customer Summary */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Customer Information
                        </h3>
                        {selectedOrder && selectedOrder.customer && (
                          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                            <div className="font-medium text-gray-900 text-lg">
                              {selectedOrder.customer.name}
                            </div>
                            <div className="text-gray-600 mt-1">
                              {selectedOrder.customer.phone}
                            </div>
                            <div className="text-gray-600">
                              ID: {selectedOrder.customer.id}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tailor Summary */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Assigned Tailor
                        </h3>
                        {selectedTailor && (
                          <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={
                                    selectedTailor.image || "/placeholder.svg"
                                  }
                                  alt={selectedTailor.name}
                                />
                                <AvatarFallback className="bg-gray-200 text-gray-700">
                                  {selectedTailor.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900 text-lg">
                                  {selectedTailor.name}
                                </div>
                                <div className="text-gray-600">
                                  Level {selectedTailor.level} • ★{" "}
                                  {selectedTailor.performance}% efficiency
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Details Summary */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Project Details
                      </h3>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">
                            Description
                          </div>
                          <div className="font-medium text-gray-900">
                            {watchedValues.description || "Not set"}
                          </div>
                        </div>
                        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">
                            Delivery Deadline
                          </div>
                          <div className="font-medium text-gray-900 text-lg">
                            {watchedValues.deadline
                              ? format(
                                  watchedValues.deadline,
                                  "EEEE, MMMM do, yyyy"
                                )
                              : "Not set"}
                          </div>
                        </div>
                        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">
                            Priority Level
                          </div>
                          <div className="font-medium text-gray-900 text-lg flex items-center gap-2">
                            {watchedValues.rush ? (
                              <>
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Rush Order
                              </>
                            ) : (
                              "Standard Priority"
                            )}
                          </div>
                        </div>
                        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="text-sm text-gray-600 mb-1">
                            Estimated Hours
                          </div>
                          <div className="font-medium text-gray-900">
                            {watch("workflows").reduce((acc, w) => w.estimatedHours + acc, 0) || "Not specified"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Workflows Summary */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Workflow Steps ({watchedValues.workflows?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {watchedValues.workflows?.map((workflow, index) => {
                          const config = workflowConfigs.find(
                            (c) => c.id === workflow.configId
                          );
                          return (
                            <div
                              key={index}
                              className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-gray-900">
                                  Step {workflow.stepNo}:{" "}
                                  {config?.title || "Unknown Configuration"}
                                </div>
                                <Badge variant="outline">Template</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mb-1">
                                <strong>Template:</strong> {config?.description}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Notes:</strong> {workflow.notes}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("tailor")}
                    className="border-gray-300"
                  >
                    Back to Tailor Selection
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                  >
                    {isSubmitting ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </form>
    </div>
  );
}
