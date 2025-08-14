export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: Customer;
  items: InvoiceItem[];
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  totalAmount: number;
}
