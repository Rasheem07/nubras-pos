"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Copy, Save, ArrowLeft, Package, Scissors, Shirt, Palette } from "lucide-react"
import Link from "next/link"

interface QuotationTemplate {
  id: string
  name: string
  description: string
  category: "custom" | "ready-made" | "alteration" | "package"
  items: {
    name: string
    description: string
    unitPrice: number
    category: string
  }[]
  terms: string
  validityDays: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function QuotationTemplatesPage() {
  const [templates, setTemplates] = useState<QuotationTemplate[]>([
    {
      id: "temp_001",
      name: "Custom Kandura Package",
      description: "Complete custom kandura with premium finishing",
      category: "custom",
      items: [
        {
          name: "Custom Kandura",
          description: "Premium fabric with custom measurements and embroidery",
          unitPrice: 650,
          category: "custom",
        },
        {
          name: "Premium Finishing",
          description: "Hand-finished seams and custom buttons",
          unitPrice: 100,
          category: "custom",
        },
      ],
      terms: "50% deposit required to start production. Delivery in 2-3 weeks. Final fitting included.",
      validityDays: 30,
      isActive: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-05-01"),
    },
    {
      id: "temp_002",
      name: "Alteration Services",
      description: "Standard alteration services package",
      category: "alteration",
      items: [
        {
          name: "Hemming",
          description: "Trouser or dress hemming",
          unitPrice: 50,
          category: "alteration",
        },
        {
          name: "Sleeve Adjustment",
          description: "Sleeve shortening or lengthening",
          unitPrice: 75,
          category: "alteration",
        },
        {
          name: "Waist Adjustment",
          description: "Taking in or letting out waist",
          unitPrice: 100,
          category: "alteration",
        },
      ],
      terms: "Alterations are final sale. Pickup within 7 days of completion.",
      validityDays: 14,
      isActive: true,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-04-15"),
    },
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<QuotationTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<QuotationTemplate>>({
    name: "",
    description: "",
    category: "custom",
    items: [],
    terms: "",
    validityDays: 30,
    isActive: true,
  })

  const categoryIcons = {
    custom: Scissors,
    "ready-made": Shirt,
    alteration: Package,
    package: Palette,
  }

  const saveTemplate = () => {
    if (selectedTemplate) {
      // Update existing template
      setTemplates(
        templates.map((t) =>
          t.id === selectedTemplate.id
            ? {
                ...selectedTemplate,
                updatedAt: new Date(),
              }
            : t,
        ),
      )
    } else {
      // Create new template
      const template: QuotationTemplate = {
        id: `temp_${Date.now()}`,
        name: newTemplate.name!,
        description: newTemplate.description!,
        category: newTemplate.category as QuotationTemplate["category"],
        items: newTemplate.items!,
        terms: newTemplate.terms!,
        validityDays: newTemplate.validityDays!,
        isActive: newTemplate.isActive!,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setTemplates([...templates, template])
    }

    setSelectedTemplate(null)
    setIsEditing(false)
    setNewTemplate({
      name: "",
      description: "",
      category: "custom",
      items: [],
      terms: "",
      validityDays: 30,
      isActive: true,
    })
  }

  const deleteTemplate = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const duplicateTemplate = (template: QuotationTemplate) => {
    const newTemplate: QuotationTemplate = {
      ...template,
      id: `temp_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates([newTemplate, ...templates])
  }

  const toggleTemplateStatus = (id: string) => {
    setTemplates(templates.map((t) => (t.id === id ? { ...t, isActive: !t.isActive, updatedAt: new Date() } : t)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/quotations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quotation Templates</h1>
            <p className="text-muted-foreground">Create and manage reusable quotation templates</p>
          </div>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const IconComponent = categoryIcons[template.category]
          return (
            <Card key={template.id} className={!template.isActive ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline" className="capitalize">
                      {template.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <Switch checked={template.isActive} onCheckedChange={() => toggleTemplateStatus(template.id)} />
                </div>
                <CardTitle className="line-clamp-2">{template.name}</CardTitle>
                <CardDescription className="line-clamp-3">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Items ({template.items.length})</h4>
                    <div className="space-y-1">
                      {template.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate">{item.name}</span>
                          <span className="text-muted-foreground">AED {item.unitPrice}</span>
                        </div>
                      ))}
                      {template.items.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{template.items.length - 3} more items</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valid for:</span>
                    <span>{template.validityDays} days</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedTemplate(template)
                        setIsEditing(true)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicateTemplate(template)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Template Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              {selectedTemplate ? "Update the template details" : "Create a reusable quotation template"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={selectedTemplate?.name || newTemplate.name}
                  onChange={(e) =>
                    selectedTemplate
                      ? setSelectedTemplate({ ...selectedTemplate, name: e.target.value })
                      : setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="template-category">Category</Label>
                <Select
                  value={selectedTemplate?.category || newTemplate.category}
                  onValueChange={(value) =>
                    selectedTemplate
                      ? setSelectedTemplate({ ...selectedTemplate, category: value as QuotationTemplate["category"] })
                      : setNewTemplate({ ...newTemplate, category: value as QuotationTemplate["category"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Orders</SelectItem>
                    <SelectItem value="ready-made">Ready-made Items</SelectItem>
                    <SelectItem value="alteration">Alterations</SelectItem>
                    <SelectItem value="package">Service Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                value={selectedTemplate?.description || newTemplate.description}
                onChange={(e) =>
                  selectedTemplate
                    ? setSelectedTemplate({ ...selectedTemplate, description: e.target.value })
                    : setNewTemplate({ ...newTemplate, description: e.target.value })
                }
                placeholder="Enter template description"
              />
            </div>

            <div>
              <Label>Template Items</Label>
              <div className="space-y-4 mt-2">
                {(selectedTemplate?.items || newTemplate.items || []).map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => {
                        const items = [...(selectedTemplate?.items || newTemplate.items || [])]
                        items[index] = { ...items[index], name: e.target.value }
                        selectedTemplate
                          ? setSelectedTemplate({ ...selectedTemplate, items })
                          : setNewTemplate({ ...newTemplate, items })
                      }}
                    />
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const items = [...(selectedTemplate?.items || newTemplate.items || [])]
                        items[index] = { ...items[index], description: e.target.value }
                        selectedTemplate
                          ? setSelectedTemplate({ ...selectedTemplate, items })
                          : setNewTemplate({ ...newTemplate, items })
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => {
                        const items = [...(selectedTemplate?.items || newTemplate.items || [])]
                        items[index] = { ...items[index], unitPrice: Number(e.target.value) }
                        selectedTemplate
                          ? setSelectedTemplate({ ...selectedTemplate, items })
                          : setNewTemplate({ ...newTemplate, items })
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const items = [...(selectedTemplate?.items || newTemplate.items || [])]
                        items.splice(index, 1)
                        selectedTemplate
                          ? setSelectedTemplate({ ...selectedTemplate, items })
                          : setNewTemplate({ ...newTemplate, items })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const items = [
                      ...(selectedTemplate?.items || newTemplate.items || []),
                      { name: "", description: "", unitPrice: 0, category: "custom" },
                    ]
                    selectedTemplate
                      ? setSelectedTemplate({ ...selectedTemplate, items })
                      : setNewTemplate({ ...newTemplate, items })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validity-days">Validity (Days)</Label>
                <Input
                  id="validity-days"
                  type="number"
                  value={selectedTemplate?.validityDays || newTemplate.validityDays}
                  onChange={(e) =>
                    selectedTemplate
                      ? setSelectedTemplate({ ...selectedTemplate, validityDays: Number(e.target.value) })
                      : setNewTemplate({ ...newTemplate, validityDays: Number(e.target.value) })
                  }
                  placeholder="30"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="is-active"
                  checked={selectedTemplate?.isActive ?? newTemplate.isActive}
                  onCheckedChange={(checked) =>
                    selectedTemplate
                      ? setSelectedTemplate({ ...selectedTemplate, isActive: checked })
                      : setNewTemplate({ ...newTemplate, isActive: checked })
                  }
                />
                <Label htmlFor="is-active">Active Template</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="template-terms">Terms & Conditions</Label>
              <Textarea
                id="template-terms"
                value={selectedTemplate?.terms || newTemplate.terms}
                onChange={(e) =>
                  selectedTemplate
                    ? setSelectedTemplate({ ...selectedTemplate, terms: e.target.value })
                    : setNewTemplate({ ...newTemplate, terms: e.target.value })
                }
                placeholder="Enter default terms and conditions for this template"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplate}>
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
