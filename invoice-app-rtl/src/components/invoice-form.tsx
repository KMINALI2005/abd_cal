"use client";

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInvoices } from "@/context/invoices-context";
import type { Invoice, Customer, InvoiceItem, InvoiceStatus } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";

// The form now accepts an optional invoice for editing
interface InvoiceFormProps {
  existingInvoice?: Invoice;
}

export function InvoiceForm({ existingInvoice }: InvoiceFormProps) {
  const router = useRouter();
  const { addInvoice, updateInvoice } = useInvoices();
  const isEditMode = !!existingInvoice;

  const [formData, setFormData] = useState({
    customer: { id: uuidv4(), name: "", email: "", phone: "" },
    items: [{ id: uuidv4(), name: "", quantity: 1, price: 0 }],
    status: "pending" as InvoiceStatus,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
  });

  // Populate form with existing invoice data if in edit mode
  useEffect(() => {
    if (isEditMode && existingInvoice) {
      setFormData({
        customer: existingInvoice.customer,
        items: existingInvoice.items,
        status: existingInvoice.status,
        issueDate: existingInvoice.issueDate,
        dueDate: existingInvoice.dueDate,
        notes: existingInvoice.notes || "",
      });
    }
  }, [isEditMode, existingInvoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in formData.customer) {
        setFormData(prev => ({ ...prev, customer: { ...prev.customer, [name]: value } }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    const item = items[index];
    if (item) {
        (item as any)[name] = name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, items }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: uuidv4(), name: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData(prev => ({ ...prev, items }));
  };

  const totalAmount = formData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer.name) {
      toast.error("الرجاء إدخال اسم العميل.");
      return;
    }
    if (formData.items.length === 0 || formData.items.some(i => !i.name)) {
        toast.error("الرجاء إضافة بند واحد على الأقل مع اسم صالح.");
        return;
    }

    if (isEditMode && existingInvoice) {
      // Update existing invoice
      updateInvoice({ ...existingInvoice, ...formData });
      toast.success("تم تحديث الفاتورة بنجاح!");
      router.push(`/invoices/${existingInvoice.id}`);
    } else {
      // Add new invoice
      addInvoice(formData);
      toast.success("تم إنشاء الفاتورة بنجاح!");
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Info Section */}
      <div className="p-6 border rounded-lg bg-card">
        <h3 className="text-lg font-medium mb-4">معلومات العميل</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">اسم العميل</Label>
            <Input id="name" name="name" value={formData.customer.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" name="email" type="email" value={formData.customer.email || ''} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Invoice Details Section */}
      <div className="p-6 border rounded-lg bg-card">
        <h3 className="text-lg font-medium mb-4">تفاصيل الفاتورة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label htmlFor="issueDate">تاريخ الإصدار</Label>
                <Input id="issueDate" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="status">الحالة</Label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                    <option value="pending">قيد الانتظار</option>
                    <option value="paid">مدفوعة</option>
                    <option value="overdue">متأخرة</option>
                </select>
            </div>
        </div>
      </div>

      {/* Invoice Items Section */}
      <div className="p-6 border rounded-lg bg-card">
        <h3 className="text-lg font-medium mb-4">البنود</h3>
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={item.id} className="flex items-end gap-2">
              <div className="flex-grow">
                <Label htmlFor={`item-name-${index}`}>اسم البند</Label>
                <Input id={`item-name-${index}`} name="name" value={item.name} onChange={e => handleItemChange(index, e)} placeholder="مثال: تصميم شعار" />
              </div>
              <div className="w-24">
                <Label htmlFor={`item-quantity-${index}`}>الكمية</Label>
                <Input id={`item-quantity-${index}`} name="quantity" type="number" value={item.quantity} onChange={e => handleItemChange(index, e)} />
              </div>
              <div className="w-32">
                <Label htmlFor={`item-price-${index}`}>السعر</Label>
                <Input id={`item-price-${index}`} name="price" type="number" value={item.price} onChange={e => handleItemChange(index, e)} />
              </div>
              <button type="button" onClick={() => removeItem(index)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} className="mt-4 flex items-center gap-2 text-primary font-medium">
          <PlusCircle className="h-5 w-5" />
          إضافة بند جديد
        </button>
      </div>

      {/* Notes and Total Section */}
       <div className="p-6 border rounded-lg bg-card">
        <h3 className="text-lg font-medium mb-4">ملاحظات إضافية</h3>
        <Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="أي تفاصيل إضافية..." />
        <div className="mt-6 text-right">
            <p className="text-muted-foreground">المجموع الكلي</p>
            <p className="text-3xl font-bold text-primary">{totalAmount.toLocaleString()} EGP</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
          {isEditMode ? "حفظ التعديلات" : "حفظ الفاتورة"}
        </button>
      </div>
    </form>
  );
}
