interface CustomerMeasurements {
  frontLength: string // الطول أمام
  backLength: string // الطول خلف
  shoulder: string // الكتف
  sleeves: string // الأيدي
  neck: string // الرقبة
  waist: string // الوسط
  chest: string // الصدر
  widthEnd: string // نهاية العرض
}

interface InvoiceItem {
  id: number
  name: string
  nameArabic?: string
  sku: string
  quantity: number
  price: number
  total: number
  measurements?: CustomerMeasurements
  isCustomOrder?: boolean
}

interface Customer {
  name: string
  nameArabic?: string
  phone: string
  address?: string
}

interface InvoiceData {
  id: string
  date: Date
  dueDate: Date
  customer: Customer
  items: InvoiceItem[]
  subtotal: number
  discountAmount: number
  discountPercentage: number
  tax: number
  total: number
  amountPaid: number
  amountDue: number
  paymentMethod: string
  notes?: string
}

export function generateArabicInvoiceHTML(invoiceData: InvoiceData): string {
  const { id, date, customer, items, subtotal, tax, total, amountPaid, amountDue } = invoiceData

  // Check if any items have measurements (custom orders)
  const hasCustomOrders = items.some((item) => item.measurements && item.isCustomOrder)

  return `
    <!DOCTYPE html>
    <html lang="en" dir="ltr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
          font-size: 12px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 2px solid #000;
          min-height: 100vh;
        }
        
        .invoice-header {
          border-bottom: 2px solid #000;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .company-section {
          flex: 1;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: normal;
          color: #000;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }
        
        .company-subtitle {
          font-size: 12px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .company-arabic {
          font-size: 24px;
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          color: #000;
          margin-bottom: 5px;
        }
        
        .company-location {
          font-size: 11px;
          color: #666;
        }
        
        .trn-section {
          text-align: center;
          margin: 10px 0;
        }
        
        .trn-number {
          font-size: 11px;
          color: #666;
        }
        
        .invoice-details {
          text-align: right;
          border-left: 1px solid #000;
          padding-left: 15px;
        }
        
        .invoice-number {
          font-size: 24px;
          font-weight: bold;
          color: #000;
          margin-bottom: 5px;
        }
        
        .invoice-label {
          font-size: 12px;
          color: #666;
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
          margin-bottom: 15px;
        }
        
        .date-section {
          border: 1px solid #000;
          padding: 8px;
          margin-bottom: 10px;
        }
        
        .date-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 11px;
        }
        
        .date-label {
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
        }
        
        .customer-section {
          border-bottom: 1px solid #000;
          padding: 15px;
          display: flex;
        }
        
        .customer-info {
          flex: 1;
        }
        
        .customer-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
        }
        
        .customer-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        
        .customer-phone {
          font-size: 12px;
          color: #666;
        }
        
        .order-details {
          border-left: 1px solid #000;
          padding-left: 15px;
          text-align: center;
        }
        
        .order-type {
          font-size: 11px;
          margin-bottom: 10px;
        }
        
        .measurements-section {
          padding: 20px;
          border-bottom: 1px solid #000;
        }
        
        .measurements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 20px;
        }
        
        .measurement-column {
          position: relative;
        }
        
        .measurement-diagram {
          width: 120px;
          height: 180px;
          border: 2px solid #000;
          margin: 0 auto 20px;
          position: relative;
          background: white;
        }
        
        .front-diagram {
          border-radius: 30px 30px 0 0;
        }
        
        .back-diagram {
          border-radius: 30px 30px 0 0;
        }
        
        .diagram-label {
          text-align: center;
          font-weight: bold;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .measurement-list {
          list-style: none;
          padding: 0;
        }
        
        .measurement-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3px 0;
          border-bottom: 1px dotted #ccc;
          font-size: 11px;
        }
        
        .measurement-label-ar {
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
          flex: 1;
          text-align: right;
        }
        
        .measurement-value {
          font-weight: bold;
          margin-left: 10px;
          min-width: 40px;
          text-align: center;
        }
        
        .pricing-section {
          padding: 15px;
          border-bottom: 1px solid #000;
        }
        
        .item-description {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
        }
        
        .pricing-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        
        .pricing-table td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
          font-size: 12px;
        }
        
        .pricing-table .label-cell {
          background: #f5f5f5;
          font-weight: bold;
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
        }
        
        .pricing-table .value-cell {
          font-weight: bold;
          font-size: 14px;
        }
        
        .total-section {
          padding: 15px;
          text-align: right;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 12px;
        }
        
        .total-row.final {
          font-size: 16px;
          font-weight: bold;
          border-top: 2px solid #000;
          padding-top: 10px;
          margin-top: 10px;
        }
        
        .footer {
          padding: 15px;
          background: #f5f5f5;
          border-top: 2px solid #000;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        
        .footer-row {
          margin-bottom: 3px;
        }
        
        .signature-section {
          padding: 20px;
          text-align: center;
          border-top: 1px solid #000;
        }
        
        .signature-line {
          border-bottom: 1px solid #000;
          width: 200px;
          margin: 20px auto 10px;
        }
        
        .signature-label {
          font-size: 11px;
          color: #666;
          font-family: 'Arial Unicode MS', Arial, sans-serif;
          direction: rtl;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .invoice-container {
            border: 2px solid #000;
            box-shadow: none;
            max-width: none;
            width: 100%;
          }
          
          @page {
            margin: 0.5cm;
            size: A4;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
          <div class="company-section">
            <div class="company-logo">alnubras</div>
            <div class="company-subtitle">gents tailoring</div>
            <div class="company-arabic">النبراس للخياطة الرجالية</div>
            <div class="company-location">Khalifa A</div>
            <div class="trn-section">
              <div class="trn-number">TRN: 100261294100003 رقم السجل الضريبي:</div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-number">${id.replace("INV-", "")}</div>
            <div class="invoice-label">رقم الفاتورة</div>
            
            <div class="date-section">
              <div class="date-row">
                <span class="date-label">تاريخ اليوم</span>
                <span>${date.toLocaleDateString("en-GB").replace(/\//g, "-")}</span>
              </div>
              <div class="date-row">
                <span class="date-label">تاريخ التسليم</span>
                <span>${invoiceData.dueDate.toLocaleDateString("en-GB").replace(/\//g, "-")}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Customer Information -->
        <div class="customer-section">
          <div class="customer-info">
            <div class="customer-label">الاسم :</div>
            <div class="customer-name">${customer.name.toUpperCase()}</div>
            <div class="customer-label">التليفون :</div>
            <div class="customer-phone">${customer.phone}</div>
          </div>
          
          <div class="order-details">
            <div class="order-type">
              <table style="border-collapse: collapse; margin: 0 auto;">
                <tr>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">عربي</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">طربوش</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">تركيب</td>
                  <td style="border: 1px solid #000; padding: 5px; font-size: 10px;">بدون</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000; padding: 5px; text-align: center;">✓</td>
                  <td style="border: 1px solid #000; padding: 5px;"></td>
                  <td style="border: 1px solid #000; padding: 5px;"></td>
                  <td style="border: 1px solid #000; padding: 5px;"></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        
        ${
          hasCustomOrders
            ? `
        <!-- Measurements Section -->
        <div class="measurements-section">
          ${items
            .filter((item) => item.measurements && item.isCustomOrder)
            .map(
              (item) => `
            <div class="item-description">${item.name} ${item.nameArabic ? "- " + item.nameArabic : ""}</div>
            
            <div class="measurements-grid">
              <!-- Front Measurements -->
              <div class="measurement-column">
                <div class="diagram-label">Front / أمام</div>
                <div class="measurement-diagram front-diagram"></div>
                
                <ul class="measurement-list">
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الطول أمام</span>
                    <span class="measurement-value">${item.measurements?.frontLength || ""}</span>
                  </li>
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الطول خلف</span>
                    <span class="measurement-value">${item.measurements?.backLength || ""}</span>
                  </li>
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الكتف</span>
                    <span class="measurement-value">${item.measurements?.shoulder || ""}</span>
                  </li>
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الأيدي</span>
                    <span class="measurement-value">${item.measurements?.sleeves || ""}</span>
                  </li>
                </ul>
              </div>
              
              <!-- Back Measurements -->
              <div class="measurement-column">
                <div class="diagram-label">Back / خلف</div>
                <div class="measurement-diagram back-diagram"></div>
                
                <ul class="measurement-list">
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الرقبة</span>
                    <span class="measurement-value">${item.measurements?.neck || ""}</span>
                  </li>
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الوسط</span>
                    <span class="measurement-value">${item.measurements?.waist || ""}</span>
                  </li>
                  <li class="measurement-item">
                    <span class="measurement-label-ar">الصدر</span>
                    <span class="measurement-value">${item.measurements?.chest || ""}</span>
                  </li>
                  <li class="measurement-item">
                    <span class="measurement-label-ar">نهاية العرض</span>
                    <span class="measurement-value">${item.measurements?.widthEnd || ""}</span>
                  </li>
                </ul>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
        
        <!-- Pricing Section -->
        <div class="pricing-section">
          <table class="pricing-table">
            <tr>
              <td class="label-cell" style="width: 200px;">قياس جيب</td>
              <td class="value-cell">${invoiceData.notes || "7.00"}</td>
            </tr>
          </table>
          
          <table class="pricing-table" style="margin-top: 20px; float: right; width: 300px;">
            <tr>
              <td class="value-cell" style="width: 100px;">${subtotal.toFixed(0)}</td>
              <td class="label-cell">VAT</td>
            </tr>
            <tr>
              <td class="value-cell">${tax.toFixed(0)}</td>
              <td class="label-cell">المجموع</td>
            </tr>
            <tr>
              <td class="value-cell">${total.toFixed(0)}</td>
              <td class="label-cell">الضريبة</td>
            </tr>
            <tr>
              <td class="value-cell">${amountPaid.toFixed(0)}</td>
              <td class="label-cell">الباقي</td>
            </tr>
          </table>
          <div style="clear: both;"></div>
        </div>
        
        <!-- Signature Section -->
        <div class="signature-section">
          <div class="signature-line"></div>
          <div class="signature-label">توقيع العميل</div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <div class="footer-row">Tel: +971 2 4458011, Mob: +971 505000988</div>
          <div class="footer-row">Al Falah Street Abu Dhabi</div>
          <div class="footer-row">Tel: +971 2 4484415, Mob: +971 505000988</div>
          <div class="footer-row">Civil Defense roundabout - Khalifa A - U.A.E.</div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
          window.onfocus = function() {
            setTimeout(() => window.close(), 500);
          }
        }
      </script>
    </body>
    </html>
  `
}

export function printArabicInvoice(invoiceData: InvoiceData): void {
  const htmlContent = generateArabicInvoiceHTML(invoiceData)

  const printWindow = window.open("", "_blank", "width=800,height=1000")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  } else {
    alert("Please allow popups to print the invoice")
  }
}
