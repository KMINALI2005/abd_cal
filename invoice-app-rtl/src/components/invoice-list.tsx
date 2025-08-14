"use client";

import { InvoiceListItem } from "./invoice-list-item";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Invoice } from "@/types/invoice";

interface InvoiceListProps {
    invoices: Invoice[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
        <h3 className="text-xl font-semibold text-foreground">لا توجد فواتير بعد</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          ابدأ بإضافة فاتورتك الأولى الآن.
        </p>
        <Link
            href="/invoices/new"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            فاتورة جديدة +
        </Link>
      </div>
    );
  }

  return (
    <motion.div layout className="flex flex-col gap-2">
      <AnimatePresence>
        {invoices.map((invoice) => (
          <motion.div
            key={invoice.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
          >
            <InvoiceListItem invoice={invoice} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
