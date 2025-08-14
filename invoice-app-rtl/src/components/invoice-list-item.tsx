import { Invoice } from "@/types/invoice";
import Link from "next/link";

export function InvoiceListItem({ invoice }: { invoice: Invoice }) {
  const statusColors: { [key: string]: string } = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const statusText: { [key: string]: string } = {
    paid: "مدفوعة",
    pending: "قيد الانتظار",
    overdue: "متأخرة",
  };

  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="block p-4 mb-2 rounded-lg shadow-sm transition-all transform hover:-translate-y-1 bg-card hover:bg-accent border border-transparent hover:border-primary/10"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="font-bold text-muted-foreground text-sm">#{invoice.invoiceNumber}</span>
          <div>
            <p className="font-bold text-foreground">{invoice.customer.name}</p>
            <p className="text-sm text-muted-foreground">تاريخ الإصدار: {invoice.issueDate}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="font-bold text-lg text-primary">
            {new Intl.NumberFormat("ar-EG", {
              style: "currency",
              currency: "EGP", // You can change this to your desired currency
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(invoice.totalAmount)}
          </p>
          <div
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              statusColors[invoice.status]
            }`}
          >
            {statusText[invoice.status]}
          </div>
        </div>
      </div>
    </Link>
  );
}
