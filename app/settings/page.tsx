"use client"
import React, { useState, ReactNode, FC } from 'react';
import { 
  Settings, 
  Store, 
  Users, 
  Package, 
  CreditCard, 
  Percent, 
  Calendar, 
  FileText, 
  Bell, 
  Printer,
  Palette,
  Globe,
  Clock,
  Receipt,
  UserCheck,
  Scissors,
  Ruler,
  Target,
  Mail,
  MessageSquare,
  Shield,
  Building,
  CheckCircle,
  Save
} from 'lucide-react';

const SettingsSection = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-5 h-5 text-gray-600" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const SettingField = ({ label, description, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
    {children}
  </div>
);

const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const POSSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'Elite Tailoring Studio',
    businessType: 'custom-tailoring',
    timezone: 'Asia/Dubai',
    currency: 'AED',
    language: 'english',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Store Settings
    defaultStore: 'main-store',
    autoCloseRegister: true,
    maxOpenSessions: 3,
    requireManagerApproval: true,
    allowMultiplePayments: true,
    
    // Sales Settings
    defaultPaymentMethod: 'cash',
    allowPartialPayments: true,
    requireCustomerInfo: true,
    autoGenerateInvoice: true,
    defaultPaymentTerms: 'net-30',
    taxRate: 5.0,
    
    // Inventory Settings
    trackInventory: true,
    lowStockAlerts: true,
    lowStockThreshold: 10,
    autoReorderEnabled: false,
    barcodeRequired: true,
    
    // Customer Settings
    autoCreateCustomer: true,
    requirePhoneNumber: true,
    enableCustomerGroups: true,
    loyaltyProgram: false,
    
    // Project & Workflow Settings
    defaultProjectStatus: 'pending',
    enableRushOrders: true,
    rushOrderMultiplier: 1.5,
    autoAssignTailors: false,
    requireMeasurements: true,
    
    // Pricing Settings
    enableCustomPricing: true,
    allowDiscounts: true,
    maxDiscountPercent: 20,
    requireDiscountApproval: true,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderStatusUpdates: true,
    paymentReminders: true,
    lowStockNotifications: true,
    
    // Receipt Settings
    printReceipts: true,
    emailReceipts: true,
    showItemDetails: true,
    showTaxBreakdown: true,
    includeTermsConditions: true,
    
    // Staff Settings
    enableTimeTracking: true,
    requireStaffLogin: true,
    enableCommissions: true,
    defaultCommissionRate: 5,
    
    // Security Settings
    sessionTimeout: 30,
    requireStrongPasswords: true,
    enableAuditLog: true,
    backupFrequency: 'daily'
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'store', label: 'Store & POS', icon: Store },
    { id: 'sales', label: 'Sales', icon: Receipt },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'projects', label: 'Projects', icon: Scissors },
    { id: 'pricing', label: 'Pricing', icon: Percent },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'receipts', label: 'Receipts', icon: FileText },
    { id: 'staff', label: 'Staff', icon: UserCheck },
  ];

  const renderGeneralSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Business Name" description="Display name for your business">
        <input
          type="text"
          value={settings.businessName}
          onChange={(e) => updateSetting('businessName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </SettingField>
      
      <SettingField label="Business Type">
        <select
          value={settings.businessType}
          onChange={(e) => updateSetting('businessType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="custom-tailoring">Custom Tailoring</option>
          <option value="ready-made">Ready-Made Clothing</option>
          <option value="alterations">Alterations Service</option>
          <option value="mixed">Mixed Services</option>
        </select>
      </SettingField>
      
      <SettingField label="Timezone">
        <select
          value={settings.timezone}
          onChange={(e) => updateSetting('timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
          <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
          <option value="Asia/Kuwait">Asia/Kuwait (GMT+3)</option>
          <option value="UTC">UTC (GMT+0)</option>
        </select>
      </SettingField>
      
      <SettingField label="Currency">
        <select
          value={settings.currency}
          onChange={(e) => updateSetting('currency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="AED">AED - UAE Dirham</option>
          <option value="SAR">SAR - Saudi Riyal</option>
          <option value="KWD">KWD - Kuwaiti Dinar</option>
          <option value="USD">USD - US Dollar</option>
        </select>
      </SettingField>
      
      <SettingField label="Language">
        <select
          value={settings.language}
          onChange={(e) => updateSetting('language', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="english">English</option>
          <option value="arabic">Arabic</option>
          <option value="both">Both (Bilingual)</option>
        </select>
      </SettingField>
      
      <SettingField label="Date Format">
        <select
          value={settings.dateFormat}
          onChange={(e) => updateSetting('dateFormat', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </SettingField>
    </div>
  );

  const renderStoreSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Default Store">
        <select
          value={settings.defaultStore}
          onChange={(e) => updateSetting('defaultStore', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="main-store">Main Store</option>
          <option value="branch-1">Branch 1</option>
          <option value="branch-2">Branch 2</option>
        </select>
      </SettingField>
      
      <SettingField label="Max Open Sessions" description="Maximum concurrent POS sessions">
        <input
          type="number"
          value={settings.maxOpenSessions}
          onChange={(e) => updateSetting('maxOpenSessions', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
          max="10"
        />
      </SettingField>
      
      <SettingField label="Auto-close Register" description="Automatically close register at end of day">
        <ToggleSwitch
          enabled={settings.autoCloseRegister}
          onChange={(value) => updateSetting('autoCloseRegister', value)}
        />
      </SettingField>
      
      <SettingField label="Require Manager Approval" description="For returns and large discounts">
        <ToggleSwitch
          enabled={settings.requireManagerApproval}
          onChange={(value) => updateSetting('requireManagerApproval', value)}
        />
      </SettingField>
      
      <SettingField label="Allow Multiple Payment Methods" description="Accept multiple payment types per transaction">
        <ToggleSwitch
          enabled={settings.allowMultiplePayments}
          onChange={(value) => updateSetting('allowMultiplePayments', value)}
        />
      </SettingField>
    </div>
  );

  const renderSalesSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Default Payment Method">
        <select
          value={settings.defaultPaymentMethod}
          onChange={(e) => updateSetting('defaultPaymentMethod', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="cash">Cash</option>
          <option value="visa">Visa/Credit Card</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </SettingField>
      
      <SettingField label="Default Payment Terms">
        <select
          value={settings.defaultPaymentTerms}
          onChange={(e) => updateSetting('defaultPaymentTerms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="net-0">Due Immediately</option>
          <option value="net-15">Net 15 Days</option>
          <option value="net-30">Net 30 Days</option>
          <option value="net-60">Net 60 Days</option>
        </select>
      </SettingField>
      
      <SettingField label="Tax Rate (%)" description="Default tax rate for sales">
        <input
          type="number"
          value={settings.taxRate}
          onChange={(e) => updateSetting('taxRate', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
          max="100"
          step="0.1"
        />
      </SettingField>
      
      <SettingField label="Allow Partial Payments" description="Accept partial payments for orders">
        <ToggleSwitch
          enabled={settings.allowPartialPayments}
          onChange={(value) => updateSetting('allowPartialPayments', value)}
        />
      </SettingField>
      
      <SettingField label="Require Customer Info" description="Mandatory customer details for all sales">
        <ToggleSwitch
          enabled={settings.requireCustomerInfo}
          onChange={(value) => updateSetting('requireCustomerInfo', value)}
        />
      </SettingField>
      
      <SettingField label="Auto-generate Invoice" description="Automatically create invoices for orders">
        <ToggleSwitch
          enabled={settings.autoGenerateInvoice}
          onChange={(value) => updateSetting('autoGenerateInvoice', value)}
        />
      </SettingField>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Track Inventory" description="Enable inventory tracking">
        <ToggleSwitch
          enabled={settings.trackInventory}
          onChange={(value) => updateSetting('trackInventory', value)}
        />
      </SettingField>
      
      <SettingField label="Low Stock Alerts" description="Get notified when stock is low">
        <ToggleSwitch
          enabled={settings.lowStockAlerts}
          onChange={(value) => updateSetting('lowStockAlerts', value)}
        />
      </SettingField>
      
      <SettingField label="Low Stock Threshold" description="Minimum quantity before alert">
        <input
          type="number"
          value={settings.lowStockThreshold}
          onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
        />
      </SettingField>
      
      <SettingField label="Auto-reorder Enabled" description="Automatically reorder low stock items">
        <ToggleSwitch
          enabled={settings.autoReorderEnabled}
          onChange={(value) => updateSetting('autoReorderEnabled', value)}
        />
      </SettingField>
      
      <SettingField label="Barcode Required" description="Require barcodes for all products">
        <ToggleSwitch
          enabled={settings.barcodeRequired}
          onChange={(value) => updateSetting('barcodeRequired', value)}
        />
      </SettingField>
    </div>
  );

  const renderCustomerSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Auto-create Customer" description="Automatically create customer records">
        <ToggleSwitch
          enabled={settings.autoCreateCustomer}
          onChange={(value) => updateSetting('autoCreateCustomer', value)}
        />
      </SettingField>
      
      <SettingField label="Require Phone Number" description="Phone number mandatory for customers">
        <ToggleSwitch
          enabled={settings.requirePhoneNumber}
          onChange={(value) => updateSetting('requirePhoneNumber', value)}
        />
      </SettingField>
      
      <SettingField label="Enable Customer Groups" description="Organize customers into groups">
        <ToggleSwitch
          enabled={settings.enableCustomerGroups}
          onChange={(value) => updateSetting('enableCustomerGroups', value)}
        />
      </SettingField>
      
      <SettingField label="Loyalty Program" description="Enable customer loyalty program">
        <ToggleSwitch
          enabled={settings.loyaltyProgram}
          onChange={(value) => updateSetting('loyaltyProgram', value)}
        />
      </SettingField>
    </div>
  );

  const renderProjectSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Default Project Status">
        <select
          value={settings.defaultProjectStatus}
          onChange={(e) => updateSetting('defaultProjectStatus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="measuring">Measuring</option>
          <option value="cutting">Cutting</option>
          <option value="sewing">Sewing</option>
        </select>
      </SettingField>
      
      <SettingField label="Enable Rush Orders" description="Allow rush order processing">
        <ToggleSwitch
          enabled={settings.enableRushOrders}
          onChange={(value) => updateSetting('enableRushOrders', value)}
        />
      </SettingField>
      
      <SettingField label="Rush Order Multiplier" description="Price multiplier for rush orders">
        <input
          type="number"
          value={settings.rushOrderMultiplier}
          onChange={(e) => updateSetting('rushOrderMultiplier', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="1"
          max="5"
          step="0.1"
        />
      </SettingField>
      
      <SettingField label="Auto-assign Tailors" description="Automatically assign projects to tailors">
        <ToggleSwitch
          enabled={settings.autoAssignTailors}
          onChange={(value) => updateSetting('autoAssignTailors', value)}
        />
      </SettingField>
      
      <SettingField label="Require Measurements" description="Measurements mandatory for custom orders">
        <ToggleSwitch
          enabled={settings.requireMeasurements}
          onChange={(value) => updateSetting('requireMeasurements', value)}
        />
      </SettingField>
    </div>
  );

  const renderPricingSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Enable Custom Pricing" description="Allow custom pricing for items">
        <ToggleSwitch
          enabled={settings.enableCustomPricing}
          onChange={(value) => updateSetting('enableCustomPricing', value)}
        />
      </SettingField>
      
      <SettingField label="Allow Discounts" description="Enable discount functionality">
        <ToggleSwitch
          enabled={settings.allowDiscounts}
          onChange={(value) => updateSetting('allowDiscounts', value)}
        />
      </SettingField>
      
      <SettingField label="Max Discount Percentage" description="Maximum discount allowed">
        <input
          type="number"
          value={settings.maxDiscountPercent}
          onChange={(e) => updateSetting('maxDiscountPercent', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
          max="100"
        />
      </SettingField>
      
      <SettingField label="Require Discount Approval" description="Manager approval for discounts">
        <ToggleSwitch
          enabled={settings.requireDiscountApproval}
          onChange={(value) => updateSetting('requireDiscountApproval', value)}
        />
      </SettingField>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Email Notifications" description="Send notifications via email">
        <ToggleSwitch
          enabled={settings.emailNotifications}
          onChange={(value) => updateSetting('emailNotifications', value)}
        />
      </SettingField>
      
      <SettingField label="SMS Notifications" description="Send notifications via SMS">
        <ToggleSwitch
          enabled={settings.smsNotifications}
          onChange={(value) => updateSetting('smsNotifications', value)}
        />
      </SettingField>
      
      <SettingField label="Order Status Updates" description="Notify customers of order status changes">
        <ToggleSwitch
          enabled={settings.orderStatusUpdates}
          onChange={(value) => updateSetting('orderStatusUpdates', value)}
        />
      </SettingField>
      
      <SettingField label="Payment Reminders" description="Remind customers of due payments">
        <ToggleSwitch
          enabled={settings.paymentReminders}
          onChange={(value) => updateSetting('paymentReminders', value)}
        />
      </SettingField>
      
      <SettingField label="Low Stock Notifications" description="Notify staff of low stock items">
        <ToggleSwitch
          enabled={settings.lowStockNotifications}
          onChange={(value) => updateSetting('lowStockNotifications', value)}
        />
      </SettingField>
    </div>
  );

  const renderReceiptSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Print Receipts" description="Automatically print receipts">
        <ToggleSwitch
          enabled={settings.printReceipts}
          onChange={(value) => updateSetting('printReceipts', value)}
        />
      </SettingField>
      
      <SettingField label="Email Receipts" description="Email receipts to customers">
        <ToggleSwitch
          enabled={settings.emailReceipts}
          onChange={(value) => updateSetting('emailReceipts', value)}
        />
      </SettingField>
      
      <SettingField label="Show Item Details" description="Include detailed item information">
        <ToggleSwitch
          enabled={settings.showItemDetails}
          onChange={(value) => updateSetting('showItemDetails', value)}
        />
      </SettingField>
      
      <SettingField label="Show Tax Breakdown" description="Display tax calculation details">
        <ToggleSwitch
          enabled={settings.showTaxBreakdown}
          onChange={(value) => updateSetting('showTaxBreakdown', value)}
        />
      </SettingField>
      
      <SettingField label="Include Terms & Conditions" description="Add T&C to receipts">
        <ToggleSwitch
          enabled={settings.includeTermsConditions}
          onChange={(value) => updateSetting('includeTermsConditions', value)}
        />
      </SettingField>
    </div>
  );

  const renderStaffSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SettingField label="Enable Time Tracking" description="Track staff working hours">
        <ToggleSwitch
          enabled={settings.enableTimeTracking}
          onChange={(value) => updateSetting('enableTimeTracking', value)}
        />
      </SettingField>
      
      <SettingField label="Require Staff Login" description="Staff must log in to use system">
        <ToggleSwitch
          enabled={settings.requireStaffLogin}
          onChange={(value) => updateSetting('requireStaffLogin', value)}
        />
      </SettingField>
      
      <SettingField label="Enable Commissions" description="Calculate staff commissions">
        <ToggleSwitch
          enabled={settings.enableCommissions}
          onChange={(value) => updateSetting('enableCommissions', value)}
        />
      </SettingField>
      
      <SettingField label="Default Commission Rate (%)" description="Default commission percentage">
        <input
          type="number"
          value={settings.defaultCommissionRate}
          onChange={(e) => updateSetting('defaultCommissionRate', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="0"
          max="50"
        />
      </SettingField>
      
      <SettingField label="Session Timeout (minutes)" description="Auto-logout after inactivity">
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          min="5"
          max="120"
        />
      </SettingField>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'store': return renderStoreSettings();
      case 'sales': return renderSalesSettings();
      case 'inventory': return renderInventorySettings();
      case 'customers': return renderCustomerSettings();
      case 'projects': return renderProjectSettings();
      case 'pricing': return renderPricingSettings();
      case 'notifications': return renderNotificationSettings();
      case 'receipts': return renderReceiptSettings();
      case 'staff': return renderStaffSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-1 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl">
            <SettingsSection 
              title={tabs.find(t => t.id === activeTab)?.label + ' Settings'} 
              icon={tabs.find(t => t.id === activeTab)?.icon || Settings}
            >
              {renderTabContent()}
            </SettingsSection>
            
            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSettings;