"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  Shield,
  Users,
  Settings,
  Printer,
} from "lucide-react"

interface Policy {
  id: string
  name: string
  type: "return" | "privacy" | "terms" | "custom" | "alteration" | "payment"
  version: string
  content: string
  isActive: boolean
  requiresSignature: boolean
  applicableToCustomers: boolean
  applicableToStaff: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  language: "en" | "ar" | "both"
}

interface PolicyTemplate {
  id: string
  name: string
  type: string
  description: string
  content: string
}

export default function PoliciesManagementPage() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "pol_001",
      name: "Return & Exchange Policy",
      type: "return",
      version: "2.1",
      content: `RETURN & EXCHANGE POLICY

1. RETURN PERIOD
- Ready-made items: 14 days from purchase date
- Custom items: No returns unless manufacturing defect
- Alterations: Final sale, no returns

2. CONDITION REQUIREMENTS
- Items must be in original condition with tags attached
- Original receipt required
- Items must be unworn and unaltered

3. REFUND METHODS
- Original payment method (preferred)
- Store credit (valid for 12 months)
- Cash refund (manager approval required)

4. EXCEPTIONS
- Custom orders are non-refundable
- Sale items are final sale
- Undergarments cannot be returned

5. EXCHANGE POLICY
- Exchanges allowed within 14 days
- Size exchanges subject to availability
- Price differences must be paid/refunded

For questions, contact: +971 50 123 4567`,
      isActive: true,
      requiresSignature: false,
      applicableToCustomers: true,
      applicableToStaff: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-05-01"),
      createdBy: "Admin",
      language: "both",
    },
    {
      id: "pol_002",
      name: "Custom Order Terms",
      type: "custom",
      version: "1.5",
      content: `CUSTOM ORDER TERMS & CONDITIONS

1. DEPOSIT & PAYMENT
- 50% deposit required to start production
- Balance due upon completion
- Payment plans available (manager approval)

2. TIMELINE
- Standard custom orders: 2-4 weeks
- Rush orders: Additional 50% fee
- Delivery dates are estimates, not guarantees

3. MEASUREMENTS
- Customer responsible for accurate measurements
- Final fitting required before completion
- Additional fittings may incur charges

4. CHANGES & CANCELLATIONS
- Changes allowed before cutting begins
- No cancellations after production starts
- Design changes may affect price and timeline

5. QUALITY GUARANTEE
- We guarantee workmanship for 30 days
- Material defects covered by manufacturer
- Customer satisfaction is our priority

I acknowledge that I have read and agree to these terms.

Customer Signature: _________________ Date: _________`,
      isActive: true,
      requiresSignature: true,
      applicableToCustomers: true,
      applicableToStaff: false,
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-04-15"),
      createdBy: "Manager",
      language: "both",
    },
    {
      id: "pol_003",
      name: "Privacy Policy",
      type: "privacy",
      version: "1.0",
      content: `PRIVACY POLICY

1. INFORMATION COLLECTION
We collect personal information including:
- Name, contact details, measurements
- Purchase history and preferences
- Payment information (securely processed)

2. USE OF INFORMATION
Your information is used to:
- Process orders and provide services
- Improve customer experience
- Send promotional offers (with consent)

3. INFORMATION SHARING
We do not sell or share personal information except:
- With service providers (payment processors)
- When required by law
- With your explicit consent

4. DATA SECURITY
- Information stored securely
- Access limited to authorized personnel
- Regular security audits conducted

5. YOUR RIGHTS
- Access your personal information
- Request corrections or deletions
- Opt-out of marketing communications

Contact us at privacy@nubras.com for any privacy concerns.`,
      isActive: true,
      requiresSignature: false,
      applicableToCustomers: true,
      applicableToStaff: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      createdBy: "Legal Team",
      language: "en",
    },
  ])

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({
    name: "",
    type: "custom",
    content: "",
    isActive: true,
    requiresSignature: false,
    applicableToCustomers: true,
    applicableToStaff: false,
    language: "en",
  })

  const policyTemplates: PolicyTemplate[] = [
    {
      id: "template_001",
      name: "Basic Return Policy",
      type: "return",
      description: "Standard return policy template for retail businesses",
      content: `RETURN POLICY TEMPLATE

1. Return Period: [X] days from purchase
2. Condition: Items must be in original condition
3. Receipt: Original receipt required
4. Refund Method: [Specify methods]
5. Exceptions: [List any exceptions]

[Add your specific terms here]`,
    },
    {
      id: "template_002",
      name: "Custom Order Agreement",
      type: "custom",
      description: "Template for custom tailoring orders",
      content: `CUSTOM ORDER AGREEMENT TEMPLATE

1. Deposit: [X]% required to begin
2. Timeline: [X] weeks estimated completion
3. Measurements: Customer responsibility
4. Changes: [Policy on changes]
5. Cancellation: [Cancellation terms]

Customer Signature: _________________ Date: _________`,
    },
  ]

  const policyTypes = [
    { value: "return", label: "Return & Exchange" },
    { value: "privacy", label: "Privacy Policy" },
    { value: "terms", label: "Terms of Service" },
    { value: "custom", label: "Custom Orders" },
    { value: "alteration", label: "Alterations" },
    { value: "payment", label: "Payment Terms" },
  ]

  const savePolicy = () => {
    if (selectedPolicy) {
      // Update existing policy
      setPolicies(
        policies.map((p) =>
          p.id === selectedPolicy.id
            ? {
                ...selectedPolicy,
                updatedAt: new Date(),
                version: incrementVersion(selectedPolicy.version),
              }
            : p,
        ),
      )
    } else {
      // Create new policy
      const policy: Policy = {
        id: `pol_${Date.now()}`,
        name: newPolicy.name!,
        type: newPolicy.type as Policy["type"],
        version: "1.0",
        content: newPolicy.content!,
        isActive: newPolicy.isActive!,
        requiresSignature: newPolicy.requiresSignature!,
        applicableToCustomers: newPolicy.applicableToCustomers!,
        applicableToStaff: newPolicy.applicableToStaff!,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "Current User",
        language: newPolicy.language as Policy["language"],
      }
      setPolicies([...policies, policy])
    }

    setSelectedPolicy(null)
    setIsEditing(false)
    setNewPolicy({
      name: "",
      type: "custom",
      content: "",
      isActive: true,
      requiresSignature: false,
      applicableToCustomers: true,
      applicableToStaff: false,
      language: "en",
    })
  }

  const incrementVersion = (version: string): string => {
    const parts = version.split(".")
    const minor = Number.parseInt(parts[1] || "0") + 1
    return `${parts[0]}.${minor}`
  }

  const deletePolicy = (id: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      setPolicies(policies.filter((p) => p.id !== id))
    }
  }

  const togglePolicyStatus = (id: string) => {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date() } : p)))
  }

  const exportPolicy = (policy: Policy) => {
    const content = `${policy.name}\nVersion: ${policy.version}\nLast Updated: ${policy.updatedAt.toLocaleDateString()}\n\n${policy.content}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${policy.name.replace(/\s+/g, "_")}_v${policy.version}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printPolicy = (policy: Policy) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${policy.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .meta { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${policy.name}</h1>
          <div class="meta">
            <strong>Version:</strong> ${policy.version}<br>
            <strong>Last Updated:</strong> ${policy.updatedAt.toLocaleDateString()}<br>
            <strong>Status:</strong> ${policy.isActive ? "Active" : "Inactive"}
          </div>
          <div class="content">${policy.content}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policies & Terms Management</h1>
          <p className="text-muted-foreground">Manage store policies, terms & conditions, and customer agreements</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Policy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Policy</DialogTitle>
                <DialogDescription>Upload a policy document from file</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Drag & drop a file here, or click to browse</p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {policy.name}
                          <Badge variant={policy.isActive ? "default" : "secondary"}>
                            {policy.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {policy.requiresSignature && (
                            <Badge variant="outline">
                              <Shield className="mr-1 h-3 w-3" />
                              Signature Required
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Version {policy.version} • Updated {policy.updatedAt.toLocaleDateString()} by{" "}
                          {policy.createdBy}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPolicy(policy)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPolicy(policy)
                          setIsEditing(true)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportPolicy(policy)}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => printPolicy(policy)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      <Switch checked={policy.isActive} onCheckedChange={() => togglePolicyStatus(policy.id)} />
                      <Button variant="ghost" size="sm" onClick={() => deletePolicy(policy.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{policy.type.replace("_", " ")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Language:</span>
                      <p className="font-medium">
                        {policy.language === "en" ? "English" : policy.language === "ar" ? "Arabic" : "Bilingual"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applies To:</span>
                      <div className="flex gap-1 mt-1">
                        {policy.applicableToCustomers && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="mr-1 h-3 w-3" />
                            Customers
                          </Badge>
                        )}
                        {policy.applicableToStaff && (
                          <Badge variant="outline" className="text-xs">
                            <Settings className="mr-1 h-3 w-3" />
                            Staff
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Content Length:</span>
                      <p className="font-medium">{policy.content.length} characters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {policyTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded p-3 text-sm font-mono">
                      {template.content.substring(0, 200)}...
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setNewPolicy({
                          ...newPolicy,
                          name: template.name,
                          type: template.type as Policy["type"],
                          content: template.content,
                        })
                        setIsEditing(true)
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Version History</CardTitle>
              <CardDescription>Track changes and updates to your policies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Updated By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell>{policy.version}</TableCell>
                      <TableCell>{policy.updatedAt.toLocaleDateString()}</TableCell>
                      <TableCell>{policy.createdBy}</TableCell>
                      <TableCell>
                        <Badge variant={policy.isActive ? "default" : "secondary"}>
                          {policy.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Active Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{policies.filter((p) => p.isActive).length}</div>
                <p className="text-sm text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Require Signature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{policies.filter((p) => p.requiresSignature).length}</div>
                <p className="text-sm text-muted-foreground">Need customer signature</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Last Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(...policies.map((p) => p.updatedAt.getTime())) > Date.now() - 30 * 24 * 60 * 60 * 1000
                    ? "Recent"
                    : "30+ days"}
                </div>
                <p className="text-sm text-muted-foreground">Most recent update</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
              <CardDescription>Ensure your policies meet business requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Return policy is active and up-to-date</span>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Privacy policy complies with local regulations</span>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Custom order terms require customer signature</span>
                  </div>
                  <Badge variant="secondary">Review</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>All policies available in required languages</span>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Policy Editor Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPolicy ? "Edit Policy" : "Create New Policy"}</DialogTitle>
            <DialogDescription>
              {selectedPolicy ? "Update the policy content and settings" : "Create a new policy document"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy-name">Policy Name</Label>
                <Input
                  id="policy-name"
                  value={selectedPolicy?.name || newPolicy.name}
                  onChange={(e) =>
                    selectedPolicy
                      ? setSelectedPolicy({ ...selectedPolicy, name: e.target.value })
                      : setNewPolicy({ ...newPolicy, name: e.target.value })
                  }
                  placeholder="Enter policy name"
                />
              </div>
              <div>
                <Label htmlFor="policy-type">Policy Type</Label>
                <Select
                  value={selectedPolicy?.type || newPolicy.type}
                  onValueChange={(value) =>
                    selectedPolicy
                      ? setSelectedPolicy({ ...selectedPolicy, type: value as Policy["type"] })
                      : setNewPolicy({ ...newPolicy, type: value as Policy["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {policyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="policy-content">Policy Content</Label>
              <Textarea
                id="policy-content"
                value={selectedPolicy?.content || newPolicy.content}
                onChange={(e) =>
                  selectedPolicy
                    ? setSelectedPolicy({ ...selectedPolicy, content: e.target.value })
                    : setNewPolicy({ ...newPolicy, content: e.target.value })
                }
                placeholder="Enter the policy content..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={selectedPolicy?.language || newPolicy.language}
                  onValueChange={(value) =>
                    selectedPolicy
                      ? setSelectedPolicy({ ...selectedPolicy, language: value as Policy["language"] })
                      : setNewPolicy({ ...newPolicy, language: value as Policy["language"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="both">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requires-signature"
                    checked={selectedPolicy?.requiresSignature || newPolicy.requiresSignature}
                    onCheckedChange={(checked) =>
                      selectedPolicy
                        ? setSelectedPolicy({ ...selectedPolicy, requiresSignature: checked })
                        : setNewPolicy({ ...newPolicy, requiresSignature: checked })
                    }
                  />
                  <Label htmlFor="requires-signature">Requires Signature</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={selectedPolicy?.isActive ?? newPolicy.isActive}
                    onCheckedChange={(checked) =>
                      selectedPolicy
                        ? setSelectedPolicy({ ...selectedPolicy, isActive: checked })
                        : setNewPolicy({ ...newPolicy, isActive: checked })
                    }
                  />
                  <Label htmlFor="is-active">Active</Label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="applicable-customers"
                    checked={selectedPolicy?.applicableToCustomers ?? newPolicy.applicableToCustomers}
                    onCheckedChange={(checked) =>
                      selectedPolicy
                        ? setSelectedPolicy({ ...selectedPolicy, applicableToCustomers: checked })
                        : setNewPolicy({ ...newPolicy, applicableToCustomers: checked })
                    }
                  />
                  <Label htmlFor="applicable-customers">Apply to Customers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="applicable-staff"
                    checked={selectedPolicy?.applicableToStaff ?? newPolicy.applicableToStaff}
                    onCheckedChange={(checked) =>
                      selectedPolicy
                        ? setSelectedPolicy({ ...selectedPolicy, applicableToStaff: checked })
                        : setNewPolicy({ ...newPolicy, applicableToStaff: checked })
                    }
                  />
                  <Label htmlFor="applicable-staff">Apply to Staff</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={savePolicy}>
              <Save className="mr-2 h-4 w-4" />
              Save Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Policy Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPolicy?.name}</DialogTitle>
            <DialogDescription>
              Version {selectedPolicy?.version} • Last updated {selectedPolicy?.updatedAt.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{selectedPolicy?.type.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={selectedPolicy?.isActive ? "default" : "secondary"}>
                    {selectedPolicy?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="border rounded p-4 bg-white">
              <pre className="whitespace-pre-wrap text-sm">{selectedPolicy?.content}</pre>
            </div>
            {selectedPolicy?.requiresSignature && (
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Customer Signature Required:</p>
                <div className="border-b border-gray-300 w-64 h-8"></div>
                <p className="text-xs text-muted-foreground mt-1">Signature</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={() => selectedPolicy && printPolicy(selectedPolicy)}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
