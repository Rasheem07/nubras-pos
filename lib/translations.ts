type TranslationKey =
  | "dashboard"
  | "sales"
  | "inventory"
  | "customers"
  | "staff"
  | "reports"
  | "settings"
  | "logout"
  | "search"
  | "totalSales"
  | "totalOrders"
  | "totalCustomers"
  | "recentSales"
  | "viewAll"
  | "addNew"
  | "save"
  | "cancel"
  | "delete"
  | "edit"
  | "view"

type Translations = {
  [key in TranslationKey]: string
}

type LanguageTranslations = {
  [lang: string]: Translations
}

export const translations: LanguageTranslations = {
  en: {
    dashboard: "Dashboard",
    sales: "Sales",
    inventory: "Inventory",
    customers: "Customers",
    staff: "Staff",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
    search: "Search",
    totalSales: "Total Sales",
    totalOrders: "Total Orders",
    totalCustomers: "Total Customers",
    recentSales: "Recent Sales",
    viewAll: "View All",
    addNew: "Add New",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
  },
  ar: {
    dashboard: "لوحة التحكم",
    sales: "المبيعات",
    inventory: "المخزون",
    customers: "العملاء",
    staff: "الموظفين",
    reports: "التقارير",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    search: "بحث",
    totalSales: "إجمالي المبيعات",
    totalOrders: "إجمالي الطلبات",
    totalCustomers: "إجمالي العملاء",
    recentSales: "المبيعات الأخيرة",
    viewAll: "عرض الكل",
    addNew: "إضافة جديد",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    view: "عرض",
  },
}

export function getTranslation(key: TranslationKey, lang = "en"): string {
  const language = translations[lang] || translations.en
  return language[key] || key
}
