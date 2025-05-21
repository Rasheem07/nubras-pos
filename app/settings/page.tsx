"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Nubras Tailoring",
    storePhone: "+971 50 123 4567",
    storeEmail: "info@nubras.com",
    storeAddress: "123 Al Wasl Road, Dubai, UAE",
    taxRate: 5,
    currency: "AED",
    language: "en",
    timezone: "Asia/Dubai",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    invoicePrefix: "INV-",
    invoiceFooter: "Thank you for your business!",
    showLogo: true,
    showTaxId: true,
    showSignature: true,
    emailInvoices: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    lowStockThreshold: 10,
    salesNotifications: true,
    customerNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleGeneralChange = (field: string, value: string | number) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: value,
    })
  }

  const handleInvoiceChange = (field: string, value: string | boolean) => {
    setInvoiceSettings({
      ...invoiceSettings,
      [field]: value,
    })
  }

  const handleNotificationChange = (field: string, value: boolean | number) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    })
  }

  const saveSettings = () => {
    // In a real app, this would save the settings
    console.log("Saving settings:", { generalSettings, invoiceSettings, notificationSettings })
    // Show success message
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <Button onClick={saveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your store's basic information and regional settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) => handleGeneralChange("storeName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) => handleGeneralChange("storePhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email Address</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) => handleGeneralChange("storeEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => handleGeneralChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => handleGeneralChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="en-ar">Bilingual (English/Arabic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleGeneralChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                      <SelectItem value="Asia/Riyadh">Riyadh (GMT+3)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0/+1)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5/-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={generalSettings.taxRate}
                    onChange={(e) => handleGeneralChange("taxRate", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={(e) => handleGeneralChange("storeAddress", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Configure how your invoices are generated and displayed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) => handleInvoiceChange("invoicePrefix", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="invoiceFooter">Invoice Footer Text</Label>
                  <Textarea
                    id="invoiceFooter"
                    value={invoiceSettings.invoiceFooter}
                    onChange={(e) => handleInvoiceChange("invoiceFooter", e.target.value)}
                  />
                </div>
                <Separator className="sm:col-span-2" />
                <div className="flex items-center justify-between sm:col-span-2">
                  <Label htmlFor="showLogo">Show Logo on Invoice</Label>
                  <Switch
                    id="showLogo"
                    checked={invoiceSettings.showLogo}
                    onCheckedChange={(checked) => handleInvoiceChange("showLogo", checked)}
                  />
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <Label htmlFor="showTaxId">Show Tax ID on Invoice</Label>
                  <Switch
                    id="showTaxId"
                    checked={invoiceSettings.showTaxId}
                    onCheckedChange={(checked) => handleInvoiceChange("showTaxId", checked)}
                  />
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <Label htmlFor="showSignature">Show Signature Line</Label>
                  <Switch
                    id="showSignature"
                    checked={invoiceSettings.showSignature}
                    onCheckedChange={(checked) => handleInvoiceChange("showSignature", checked)}
                  />
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <Label htmlFor="emailInvoices">Automatically Email Invoices</Label>
                  <Switch
                    id="emailInvoices"
                    checked={invoiceSettings.emailInvoices}
                    onCheckedChange={(checked) => handleInvoiceChange("emailInvoices", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system alerts and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockAlerts" className="block">
                      Low Stock Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when inventory is running low</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("lowStockAlerts", checked)}
                  />
                </div>
                {notificationSettings.lowStockAlerts && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={notificationSettings.lowStockThreshold}
                      onChange={(e) => handleNotificationChange("lowStockThreshold", Number(e.target.value))}
                      className="max-w-xs"
                    />
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="salesNotifications" className="block">
                      Sales Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified about new sales</p>
                  </div>
                  <Switch
                    id="salesNotifications"
                    checked={notificationSettings.salesNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("salesNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customerNotifications" className="block">
                      Customer Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified about new customers</p>
                  </div>
                  <Switch
                    id="customerNotifications"
                    checked={notificationSettings.customerNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("customerNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="block">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="block">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>Manage user accounts and access permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                User management functionality will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage system backups and data restoration.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Backup and restore functionality will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
