"use client";

import { useParams, useRouter } from "next/navigation";
import { useInvoices } from "@/context/invoices-context";
import { Header } from "@/components/header";
import { ArrowRight, Edit, Share2, Trash2, Printer, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";

// دالة لتنسيق العملة
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function InvoiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { getInvoiceById, deleteInvoice } = useInvoices();

  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const foundInvoice = getInvoiceById(id);
      if (foundInvoice) {
        setInvoice(foundInvoice);
      }
    }
  }, [params.id, getInvoiceById]);

  const handleDelete = () => {
    if (invoice && window.confirm("هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟")) {
      deleteInvoice(invoice.id);
      // toast.success("تم حذف الفاتورة بنجاح"); // Toast will be added later
      router.push("/");
    }
  };

  const handleShare = () => {
    if (!invoice) return;

    let message = `*فاتورة من تطبيق الفواتير*\n\n`;
    message += `*رقم الفاتورة:* ${invoice.invoiceNumber}\n`;
    message += `*العميل:* ${invoice.customer.name}\n`;
    message += `*المبلغ الإجمالي:* ${formatCurrency(invoice.totalAmount)}\n\n`;
    message += `*الحالة:* ${statusText[invoice.status]}\n\n`;
    message += `شكراً لتعاملكم معنا!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`);
  };

  const handleExportToExcel = () => {
    if (!invoice) return;

    // 1. تحضير البيانات
    const data = [
      ["فاتورة رقم:", invoice.invoiceNumber],
      ["تاريخ الإصدار:", invoice.issueDate],
      ["تاريخ الاستحقاق:", invoice.dueDate],
      [], // سطر فارغ
      ["بيانات العميل:"],
      ["الاسم:", invoice.customer.name],
      ["البريد الإلكتروني:", invoice.customer.email],
      ["الهاتف:", invoice.customer.phone],
      [], // سطر فارغ
      ["البنود"],
    ];

    const itemsHeader = ["البند", "الكمية", "السعر", "المجموع"];
    const itemsData = invoice.items.map(item => [
      item.name,
      item.quantity,
      item.price,
      item.price * item.quantity
    ]);

    const finalData = [
        ...data,
        itemsHeader,
        ...itemsData,
        [], // سطر فارغ
        ["", "", "المجموع الكلي:", invoice.totalAmount]
    ];

    // 2. إنشاء ورقة العمل
    const ws = XLSX.utils.aoa_to_sheet(finalData);

    // 3. إنشاء المصنف
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");

    // 4. تحميل الملف
    XLSX.writeFile(wb, `Invoice-${invoice.invoiceNumber}.xlsx`);
  };

  if (!invoice) {
    return (
      <div>
        <Header />
        <main className="container mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold">لم يتم العثور على الفاتورة</h2>
            <p className="text-muted-foreground mt-2">
              الفاتورة التي تبحث عنها غير موجودة.
            </p>
            <Link href="/" className="mt-4 inline-flex items-center gap-2 text-primary">
                العودة إلى لوحة التحكم <ArrowRight className="h-4 w-4"/>
            </Link>
        </main>
      </div>
    );
  }

  const statusColors: { [key: string]: string } = {
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  const statusText: { [key:string]: string } = { paid: "مدفوعة", pending: "قيد الانتظار", overdue: "متأخرة" };

  return (
    <div className="bg-background min-h-screen">
      <Header className="no-print" />
      <main className="container mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* رأس الصفحة مع الأزرار */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 no-print">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                    فاتورة <span className="text-muted-foreground">#{invoice.invoiceNumber}</span>
                </h2>
                <div className={`mt-2 px-3 py-1 text-sm font-bold rounded-full inline-block ${statusColors[invoice.status]}`}>
                    {statusText[invoice.status]}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Link href={`/invoices/${invoice.id}/edit`} className="p-2 rounded-md hover:bg-accent">
                    <Edit className="h-5 w-5"/>
                </Link>
                <button onClick={handleDelete} className="p-2 rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-5 w-5"/></button>
                <button onClick={handleShare} className="p-2 rounded-md hover:bg-accent"><Share2 className="h-5 w-5"/></button>
                <button onClick={() => window.print()} className="p-2 rounded-md hover:bg-accent"><Printer className="h-5 w-5"/></button>
                <button onClick={handleExportToExcel} className="p-2 rounded-md hover:bg-accent"><FileSpreadsheet className="h-5 w-5"/></button>
            </div>
        </div>

        {/* تفاصيل الفاتورة */}
        <div className="p-6 border rounded-lg bg-card space-y-6 printable-area">
            {/* معلومات العميل والتواريخ */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">العميل</h3>
                    <p className="font-bold text-foreground">{invoice.customer.name}</p>
                    <p className="text-muted-foreground">{invoice.customer.email}</p>
                    <p className="text-muted-foreground">{invoice.customer.phone}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-lg font-semibold mb-2">التواريخ</h3>
                    <p className="text-muted-foreground">تاريخ الإصدار: {invoice.issueDate}</p>
                    <p className="text-muted-foreground">تاريخ الاستحقاق: {invoice.dueDate}</p>
                </div>
            </div>

            {/* جدول البنود */}
            <div>
                <h3 className="text-lg font-semibold mb-2">البنود</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b">
                            <tr>
                                <th className="p-2 font-semibold">البند</th>
                                <th className="p-2 font-semibold">الكمية</th>
                                <th className="p-2 font-semibold">السعر</th>
                                <th className="p-2 font-semibold text-left">المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">{formatCurrency(item.price)}</td>
                                    <td className="p-2 text-left">{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* المجموع والملاحظات */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div>
                    {invoice.notes && (
                        <>
                            <h3 className="text-lg font-semibold mb-2">ملاحظات</h3>
                            <p className="text-muted-foreground">{invoice.notes}</p>
                        </>
                    )}
                </div>
                <div className="text-left space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع الفرعي:</span>
                        <span>{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-primary">
                        <span>المجموع الكلي:</span>
                        <span>{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                </div>
            </div>
        </div>
        </motion.div>
      </main>
    </div>
  );
}
