"use client";

import { Header } from "@/components/header";
import { InvoiceForm } from "@/components/invoice-form";
import { useInvoices } from "@/context/invoices-context";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EditInvoicePage() {
  const params = useParams();
  const { getInvoiceById } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const foundInvoice = getInvoiceById(id);
      setInvoice(foundInvoice || null);
    }
    setIsLoading(false);
  }, [params.id, getInvoiceById]);

  if (isLoading) {
    // A simple loader, can be replaced with a skeleton component
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  if (!invoice) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold">لم يتم العثور على الفاتورة</h2>
            <Link href="/" className="mt-4 inline-flex items-center gap-2 text-primary">
                العودة إلى لوحة التحكم <ArrowRight className="h-4 w-4"/>
            </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">تعديل الفاتورة #{invoice.invoiceNumber}</h2>
          <p className="text-muted-foreground">
            قم بتحديث التفاصيل أدناه.
          </p>
        </div>
        <InvoiceForm existingInvoice={invoice} />
      </main>
    </div>
  );
}
