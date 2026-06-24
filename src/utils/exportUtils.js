import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatDateDMY, formatCurrency, calcPending } from './formatters';

/**
 * Export Utilities — PDF & Excel
 */

/**
 * Export orders data to PDF
 */
export function exportToPDF(orders, filename = 'customer-data') {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(18);
  doc.setTextColor(183, 110, 121); // Rose gold
  doc.text('Customer Database Report', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(122, 112, 103);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 30);

  const tableData = orders.map((order) => [
    order.order_number || '—',
    formatDateDMY(order.entry_date),
    formatDateDMY(order.delivery_date),
    order.customer?.name || '—',
    order.customer?.phone || '—',
    (order.description || '').substring(0, 60),
    formatCurrency(order.full_amount),
    formatCurrency(order.advance_amount),
    formatCurrency(calcPending(order.full_amount, order.advance_amount)),
    order.delivery_status ? 'Delivered' : 'Pending',
  ]);

  doc.autoTable({
    startY: 36,
    head: [
      [
        'Order ID',
        'Entry Date',
        'Delivery Date',
        'Name',
        'Phone',
        'Description',
        'Full Amt',
        'Advance',
        'Pending',
        'Status',
      ],
    ],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [183, 110, 121],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [253, 248, 245],
    },
    columnStyles: {
      5: { cellWidth: 50 }, // Description column wider
    },
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Export orders data to Excel
 */
export function exportToExcel(orders, filename = 'customer-data') {
  const data = orders.map((order) => ({
    'Order ID': order.order_number || '',
    'Entry Date': formatDateDMY(order.entry_date),
    'Delivery Date': formatDateDMY(order.delivery_date),
    'Customer Name': order.customer?.name || '',
    'Phone': order.customer?.phone || '',
    'Description': order.description || '',
    'Full Amount': order.full_amount,
    'Advance Amount': order.advance_amount,
    'Pending Amount': calcPending(order.full_amount, order.advance_amount),
    'Status': order.delivery_status ? 'Delivered' : 'Pending',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');

  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, 15),
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `${filename}.xlsx`);
}
