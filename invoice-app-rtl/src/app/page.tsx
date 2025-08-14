"use client";

import { Header } from "@/components/header";
import { InvoiceList } from "@/components/invoice-list";
import { useInvoices } from "@/context/invoices-context";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { InvoiceStatus } from "@/types/invoice";

export default function Home() {
  const { invoices } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => {
        if (statusFilter === "all") return true;
        return invoice.status === statusFilter;
      })
      .filter(invoice => {
        const query = searchQuery.toLowerCase();
        return (
          invoice.customer.name.toLowerCase().includes(query) ||
          invoice.invoiceNumber.toLowerCase().includes(query)
        );
      });
  }, [invoices, searchQuery, statusFilter]);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">الفواتير</h2>
              <p className="text-muted-foreground">
                عرض وإدارة فواتيرك.
              </p>
            </div>
            <Link
              href="/invoices/new"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>فاتورة جديدة</span>
            </Link>
          </div>

          {/* Search and Filter UI */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6 p-4 bg-card border rounded-lg">
            <div className="relative w-full md:flex-grow">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="ابحث عن فاتورة (بالرقم أو اسم العميل)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                />
            </div>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | "all")}
                className="flex h-10 w-full md:w-48 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            >
                <option value="all">كل الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="paid">مدفوعة</option>
                <option value="overdue">متأخرة</option>
            </select>
          </div>

          <InvoiceList invoices={filteredInvoices} />
        </motion.div>
      </main>
    </div>
  );
}
