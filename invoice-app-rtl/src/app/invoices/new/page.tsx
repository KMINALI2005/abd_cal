import { Header } from "@/components/header";
import { InvoiceForm } from "@/components/invoice-form";
import { motion } from "framer-motion";

export default function NewInvoicePage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">فاتورة جديدة</h2>
            <p className="text-muted-foreground">
              املأ التفاصيل أدناه لإنشاء فاتورة جديدة.
            </p>
          </div>
          <InvoiceForm />
        </motion.div>
      </main>
    </div>
  );
}
